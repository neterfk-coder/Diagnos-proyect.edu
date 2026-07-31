import { NextResponse } from "next/server";
import {
  clienteGroq,
  MODELO_VISION,
  MODELO_TEXTO,
  extraerJSON,
  textoDeRespuesta,
  completarConEsquema,
  esLimiteDeTasa,
} from "@/lib/groq";
import { catalogoParaPrompt, buscarPorCodigo, CODIGOS } from "@/lib/misconceptions";
import { registrarDiagnostico, usuarioDesdeJWT } from "@/lib/appwrite-servidor";

export const maxDuration = 60;

/**
 * Las instrucciones van en inglés (el modelo las sigue mejor y así hay un
 * solo prompt que mantener), pero el texto que verá el estudiante se genera
 * en el idioma que haya elegido en la interfaz.
 */
const LENGUAS = { en: "English", es: "Spanish" };

const MENSAJE_LIMITE = {
  en: "Groq's per-minute limit was just reached — wait a minute and try again.",
  es: "Se alcanzó el límite por minuto de Groq — espera un minuto y vuelve a intentarlo.",
};

/**
 * Esquema del diagnóstico. Con el modelo de texto se aplica en modo estricto,
 * así que el servidor garantiza la forma: no puede llegar un paso sin estado
 * ni un código de misconception inventado.
 */
const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "ejercicio",
    "procedimiento_correcto",
    "pasos",
    "paso_roto",
    "misconception",
    "explicacion",
    "pregunta_inicial",
  ],
  properties: {
    ejercicio: { type: "string" },
    procedimiento_correcto: { type: "boolean" },
    pasos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["n", "texto", "estado"],
        properties: {
          n: { type: "integer" },
          texto: { type: "string" },
          estado: { type: "string", enum: ["correcto", "erroneo", "arrastrado"] },
        },
      },
    },
    paso_roto: { type: ["integer", "null"] },
    misconception: { type: "string", enum: CODIGOS },
    explicacion: { type: "string" },
    pregunta_inicial: { type: "string" },
  },
};

function sistema(idioma) {
  const lengua = LENGUAS[idioma] || LENGUAS.en;

  return `OUTPUT LANGUAGE: ${lengua}. The values of "ejercicio", "explicacion" and
"pregunta_inicial" MUST be written in ${lengua}. This applies to every single one of
them — not just some. The JSON keys and the status values stay in Spanish.

=====================================================================
HARD CONSTRAINT — the product breaks if you get this wrong
=====================================================================
"explicacion" and "pregunta_inicial" must NEVER contain the correct answer, the
corrected step, or the correct rule.

Forbidden in any form: saying what the sign, term or operation "must", "should",
"has to" or "needs to" be; explaining what is required to preserve the equality;
naming the operation that fixes the step.

  BAD:  "You kept the sign, but it has to be reversed to preserve the equality."
  BAD:  "That sign change is necessary to keep both sides equal."
  BAD:  "...as if copying it over, when transferring a term requires changing its sign."
  BAD:  "What operation should you apply to +5 to isolate 3x?"
  GOOD: "You moved the 5 across and kept it positive, as if crossing the equals sign
         were simply copying the term over to the other side."
  GOOD: "When you wrote step 2, what did you picture happening to the 5?"

"explicacion" describes ONLY the false assumption the student appears to have made.
It is a description of their thinking, not a lesson. The student discovers the rule
later, in the Socratic dialogue. Revealing it here defeats the entire product.
=====================================================================

You are the pedagogical diagnosis engine of Diagnos, an educational tool
for first-year secondary school algebra.

You will receive a student's work (typed text or a photo of their notebook).
Your task is NOT to correct the final answer: it is to reconstruct their reasoning
step by step, locate the FIRST step where the reasoning breaks, and classify the
underlying misconception using exclusively this catalogue:

${catalogoParaPrompt(idioma)}

Rules:
1. Transcribe the student's steps faithfully, one by one, exactly as they wrote them.
2. Mark each step as "correcto" or "erroneo". Only the FIRST broken step gets
   "erroneo"; later steps that follow from that error are marked "arrastrado".
3. If the whole procedure is correct, set "procedimiento_correcto" to true and
   "paso_roto" to null.
4. "explicacion": 2-3 sentences, addressed to the student as "you", warm and direct,
   no condescension. Obey the HARD CONSTRAINT above.
5. "pregunta_inicial": one short open question that makes the student look again at the
   broken step. It must not hint at the fix. Obey the HARD CONSTRAINT above.
6. Write the values of "ejercicio", "explicacion" and "pregunta_inicial" in ${lengua}.
   The keys and the status values ("correcto", "erroneo", "arrastrado") stay in
   Spanish exactly as specified, whatever the output language.
7. "misconception" must be one of the catalogue codes above, nothing else.

Reply with a single JSON object of this exact shape and nothing else:
{
  "ejercicio": "the exercise statement you detected",
  "procedimiento_correcto": false,
  "pasos": [
    { "n": 1, "texto": "3x + 5 = 20", "estado": "correcto" },
    { "n": 2, "texto": "3x = 20 + 5", "estado": "erroneo" },
    { "n": 3, "texto": "x = 25/3", "estado": "arrastrado" }
  ],
  "paso_roto": 2,
  "misconception": "SIG-01",
  "explicacion": "explanation focused on the thinking, 2-3 sentences, without giving the solution",
  "pregunta_inicial": "first Socratic question to open the dialogue"
}

Final reminder: "ejercicio", "explicacion" and "pregunta_inicial" in ${lengua}, and
neither the rule nor the corrected step appears anywhere in your answer.`;
}

export async function POST(peticion) {
  // Fuera del try para que el catch sepa en qué idioma responder incluso si
  // el fallo ocurre después de leer el cuerpo de la petición.
  let idioma = "en";
  try {
    const datos = await peticion.json();
    idioma = datos.idioma;
    const { texto, imagenBase64, tipoImagen, jwt } = datos;

    if (!texto && !imagenBase64) {
      return NextResponse.json(
        { error: "Send the written work or a photo of the notebook." },
        { status: 400 }
      );
    }

    // Con foto hace falta el modelo de visión, que solo admite json_object.
    // Sin foto se usa el de texto, que garantiza el esquema en modo estricto.
    const conImagen = Boolean(imagenBase64);
    const modelo = conImagen ? MODELO_VISION : MODELO_TEXTO;

    const lengua = LENGUAS[idioma] || LENGUAS.en;
    const base = texto
      ? `Student's work:\n${texto}`
      : "Analyze the handwritten work in the image.";
    // El recordatorio del idioma se repite aquí: en el mensaje de usuario se
    // respeta mucho mejor que enterrado en medio del prompt de sistema.
    const instruccion = `${base}\n\nWrite "ejercicio", "explicacion" and "pregunta_inicial" in ${lengua}. Do not reveal the rule or the corrected step.`;

    const contenidoUsuario = conImagen
      ? [
          { type: "text", text: instruccion },
          {
            type: "image_url",
            image_url: {
              url: `data:${tipoImagen || "image/jpeg"};base64,${imagenBase64}`,
            },
          },
        ]
      : instruccion;

    const formato = conImagen
      ? { type: "json_object" }
      : {
          type: "json_schema",
          json_schema: { name: "diagnostico", strict: true, schema: ESQUEMA },
        };

    const groq = clienteGroq();
    const respuesta = await completarConEsquema(groq, {
      model: modelo,
      // Margen amplio: los tokens de razonamiento salen de aquí, y quedarse
      // corto produce JSON truncado en lugar de un error claro.
      max_completion_tokens: conImagen ? 2000 : 4000,
      // Temperatura baja: aquí interesa que siga las reglas, no que sea creativo.
      temperature: 0.2,
      response_format: formato,
      // Cada modelo admite valores distintos: gpt-oss acepta low/medium/high,
      // qwen solo none/default. En la ruta con foto se desactiva el
      // razonamiento porque disparaba la latencia por encima del límite de
      // tiempo de la función en producción.
      reasoning_effort: conImagen ? "none" : "low",
      messages: [
        { role: "system", content: sistema(idioma) },
        { role: "user", content: contenidoUsuario },
      ],
    });

    const diagnostico = extraerJSON(textoDeRespuesta(respuesta));
    diagnostico.detalle_misconception = buscarPorCodigo(diagnostico.misconception);

    // Registro anónimo para el panel docente. registrarDiagnostico() nunca
    // lanza, así que un fallo de la base de datos no puede tumbar un
    // diagnóstico que ya salió bien.
    //
    // El aula NO se toma de lo que manda el cliente: se deriva del usuario
    // verificado por JWT. Si no hay sesión, el diagnóstico se guarda sin
    // aula y no aparecerá en el panel de ningún docente.
    if (!diagnostico.procedimiento_correcto) {
      const usuario = await usuarioDesdeJWT(jwt);
      await registrarDiagnostico({
        ...diagnostico,
        aula: usuario?.prefs?.aula || null,
      });
    }

    return NextResponse.json(diagnostico);
  } catch (error) {
    if (esLimiteDeTasa(error)) {
      console.warn("[diagnose] límite de tasa de Groq alcanzado");
      return NextResponse.json(
        { error: MENSAJE_LIMITE[idioma] || MENSAJE_LIMITE.en, codigo: "limite" },
        { status: 429 }
      );
    }

    console.error("[diagnose]", error);
    return NextResponse.json(
      { error: "The diagnosis could not be completed. Check your API key and try again." },
      { status: 500 }
    );
  }
}
