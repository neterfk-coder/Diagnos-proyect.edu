import { NextResponse } from "next/server";
import {
  clienteGroq,
  MODELO_TEXTO,
  extraerJSON,
  textoDeRespuesta,
  completarConEsquema,
  esLimiteDeTasa,
} from "@/lib/groq";
import { textoMisconception } from "@/lib/misconceptions";

export const maxDuration = 60;

const LENGUAS = { en: "English", es: "Spanish" };

/** Orden fijo de los tres niveles. Son identificadores, no texto visible. */
const NIVELES = ["basico", "intermedio", "desafio"];

const EJERCICIO = {
  type: "object",
  additionalProperties: false,
  required: ["enunciado", "pista"],
  properties: {
    enunciado: { type: "string" },
    pista: { type: "string" },
  },
};

/**
 * Tres campos con nombre en vez de un array: el modo estricto no admite
 * minItems/maxItems, así que con un array el modelo devolvía a veces un solo
 * ejercicio. Con esta forma, los tres están garantizados por el esquema.
 */
const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: NIVELES,
  properties: {
    basico: EJERCICIO,
    intermedio: EJERCICIO,
    desafio: EJERCICIO,
  },
};

export async function POST(peticion) {
  try {
    const { diagnostico, idioma } = await peticion.json();

    if (!diagnostico) {
      return NextResponse.json({ error: "Missing diagnosis." }, { status: 400 });
    }

    const lengua = LENGUAS[idioma] || LENGUAS.en;
    const detalle = textoMisconception(diagnostico.detalle_misconception, idioma);

    const sistema = `OUTPUT LANGUAGE: ${lengua}. Every "enunciado" and every "pista"
MUST be written in ${lengua}.

=====================================================================
HARD CONSTRAINT — the product breaks if you get this wrong
=====================================================================
A "pista" must NEVER state the rule, the operation or the answer. It points at what
to notice, nothing more.

  BAD:  "When you move -7 to the other side, you must change its sign."
  BAD:  "Remember to reverse the sign when transposing a term."
  GOOD: "Try putting your result back into the original equation and see if both
         sides still match."
  GOOD: "Compare what is on each side before and after your second step."
=====================================================================

You are the targeted-practice generator of Diagnos.
Create exactly 3 NEW first-year secondary school algebra exercises designed
specifically to attack this misconception:

${diagnostico.misconception} — ${detalle?.nombre || ""}:
${detalle?.descripcion || ""}

The student's original exercise: ${diagnostico.ejercicio}

Rules:
- Each of the three exercises must put the student in exactly the situation where
  they tend to fail, with increasing difficulty: "basico", then "intermedio",
  then "desafio".
- "desafio" must include the edge case where the misconception produces an obviously
  absurd result, so that the exercise itself disproves it.
- Do not reuse the numbers from the original exercise.
- Every exercise must be different from the other two.

Final reminder: "enunciado" and "pista" in ${lengua}, and no hint may reveal the rule.`;

    const groq = clienteGroq();
    const respuesta = await completarConEsquema(groq, {
      model: MODELO_TEXTO,
      // gpt-oss razona antes de responder y esos tokens salen del mismo
      // presupuesto: con el límite justo se quedaba sin margen y devolvía
      // JSON truncado (json_validate_failed con failed_generation vacío).
      max_completion_tokens: 4000,
      reasoning_effort: "low",
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: { name: "practica", strict: true, schema: ESQUEMA },
      },
      messages: [
        { role: "system", content: sistema },
        {
          role: "user",
          content: `Generate the three exercises in ${lengua}. Hints must not reveal the rule.`,
        },
      ],
    });

    const datos = extraerJSON(textoDeRespuesta(respuesta));

    // La interfaz espera una lista ordenada con su nivel dentro.
    const ejercicios = NIVELES.map((nivel) => ({ nivel, ...datos[nivel] }));

    return NextResponse.json({ ejercicios });
  } catch (error) {
    if (esLimiteDeTasa(error)) {
      console.warn("[exercises] límite de tasa de Groq alcanzado");
      return NextResponse.json(
        { error: "Groq's per-minute limit was just reached.", codigo: "limite" },
        { status: 429 }
      );
    }

    console.error("[exercises]", error);
    return NextResponse.json(
      { error: "The exercises could not be generated." },
      { status: 500 }
    );
  }
}
