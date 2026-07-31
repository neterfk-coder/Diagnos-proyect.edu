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

/**
 * Lo importante aquí no es si el resultado es correcto, sino si el estudiante
 * ha vuelto a cometer la MISMA concepción errónea. Un acierto por casualidad
 * no demuestra nada; un fallo aritmético con el razonamiento bien, sí.
 */
const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: ["correcto", "reincide", "comentario", "siguiente_pregunta"],
  properties: {
    correcto: { type: "boolean" },
    reincide: { type: "boolean" },
    comentario: { type: "string" },
    siguiente_pregunta: { type: ["string", "null"] },
  },
};

function sistema(idioma, detalle, codigo) {
  const lengua = LENGUAS[idioma] || LENGUAS.en;

  return `OUTPUT LANGUAGE: ${lengua}. Write "comentario" and "siguiente_pregunta"
in ${lengua}.

You are checking whether a student has overcome a specific misconception.

The misconception being targeted is ${codigo} — ${detalle?.nombre || ""}:
${detalle?.descripcion || ""}

You receive an exercise and the student's work on it. Judge two separate things:

1. "correcto": is the final result right?
2. "reincide": did the student commit THAT SPECIFIC misconception again?

These are independent and both matter:
- Right answer but the misconception is visible in the steps → correcto true, reincide true.
  Getting there by luck or by a compensating second error proves nothing.
- Wrong answer from a plain arithmetic slip, with the targeted reasoning applied
  correctly → correcto false, reincide false. That is real progress, say so.

=====================================================================
HARD CONSTRAINT
=====================================================================
"comentario" is at most 2 sentences and NEVER contains the correct answer, the
correct rule, or the corrected step. Describe ONLY what you see in their work.

Never write "instead of X", "should be X", "it has to be X", and never show the
corrected expression. Naming what they wrote is fine; naming what they should have
written is not.

  BAD:  "Almost: remember the sign flips when a term changes side."
  BAD:  "You kept the minus sign, writing 9-7 instead of 9+7."
  BAD:  "The -7 should have become +7 on the right."
  GOOD: "You moved the -7 across and kept it negative, the same move that broke
         the original exercise."
  GOOD: "This time the term changed sign as it crossed. That is exactly the step
         that was failing before."
  GOOD: "The reasoning about the parentheses holds up; the slip is in the final
         division."

"siguiente_pregunta": if reincide is true, one short OPEN question that sends the
student back to look at that step. It must not contain the answer either.

  BAD:  "What sign should the term you moved have?"
  GOOD: "Check your second step: what did you do to each side there?"

Otherwise null.
=====================================================================

Reply with one JSON object and nothing else.`;
}

export async function POST(peticion) {
  try {
    const { enunciado, respuesta, misconception, detalle, idioma } =
      await peticion.json();

    if (!enunciado || !respuesta?.trim()) {
      return NextResponse.json(
        { error: "Send the exercise and the student's work." },
        { status: 400 }
      );
    }

    const texto = textoMisconception(detalle, idioma);
    const groq = clienteGroq();

    const salida = await completarConEsquema(groq, {
      model: MODELO_TEXTO,
      max_completion_tokens: 3000,
      reasoning_effort: "low",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: { name: "verificacion", strict: true, schema: ESQUEMA },
      },
      messages: [
        { role: "system", content: sistema(idioma, texto, misconception) },
        {
          role: "user",
          content: `Exercise:\n${enunciado}\n\nStudent's work:\n${respuesta.trim()}`,
        },
      ],
    });

    return NextResponse.json(extraerJSON(textoDeRespuesta(salida)));
  } catch (error) {
    if (esLimiteDeTasa(error)) {
      console.warn("[verificar] límite de tasa de Groq alcanzado");
      return NextResponse.json(
        { error: "Groq's per-minute limit was just reached.", codigo: "limite" },
        { status: 429 }
      );
    }

    console.error("[verificar]", error);
    return NextResponse.json(
      { error: "The answer could not be checked. Please try again." },
      { status: 500 }
    );
  }
}
