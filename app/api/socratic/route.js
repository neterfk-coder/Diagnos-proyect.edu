import { NextResponse } from "next/server";
import { clienteGroq, MODELO_TEXTO, textoDeRespuesta, esLimiteDeTasa } from "@/lib/groq";
import { textoMisconception } from "@/lib/misconceptions";

export const maxDuration = 60;

const LENGUAS = { en: "English", es: "Spanish" };

function sistemaSocratico(diagnostico, idioma) {
  const lengua = LENGUAS[idioma] || LENGUAS.en;
  const detalle = textoMisconception(diagnostico.detalle_misconception, idioma);

  return `You are the Socratic tutor of Diagnos. You are working with a first-year
secondary school student who made a mistake in this algebra exercise.

Diagnosis context (FOR YOU ONLY, do not recite it):
- Exercise: ${diagnostico.ejercicio}
- Student's steps: ${JSON.stringify(diagnostico.pasos)}
- Step where the reasoning broke: ${diagnostico.paso_roto}
- Misconception: ${diagnostico.misconception} — ${detalle?.nombre || ""}

Method:
1. Guide ONLY with questions. Never give the answer, the correct rule or the fixed step.
2. One single question per turn, short and concrete, anchored in what the student wrote.
3. If the student is getting close, acknowledge it briefly and sharpen the next question.
4. If they get frustrated or stuck for two turns in a row, offer a minimal hint (a small
   counterexample with numbers), but still without giving the solution.
5. When the student states the error AND the correct step by themselves, celebrate it in
   one sentence, summarise in one line the idea they just discovered, and end your message
   EXACTLY with the tag [DESCUBIERTO] at the very end.
6. Tone: warm, brief, peer to peer. No emojis. Plain prose, no markdown, no headings.
7. Write every message to the student in ${lengua}. The [DESCUBIERTO] tag is always
   written exactly like that, whatever the language.`;
}

export async function POST(peticion) {
  try {
    const { diagnostico, historial, idioma } = await peticion.json();

    if (!diagnostico || !Array.isArray(historial)) {
      return NextResponse.json({ error: "Incomplete request." }, { status: 400 });
    }

    const mensajes = historial.map((m) => ({
      role: m.rol === "estudiante" ? "user" : "assistant",
      content: m.texto,
    }));

    const groq = clienteGroq();
    const respuesta = await groq.chat.completions.create({
      model: MODELO_TEXTO,
      max_completion_tokens: 2000,
      reasoning_effort: "low",
      temperature: 0.5,
      messages: [
        { role: "system", content: sistemaSocratico(diagnostico, idioma) },
        ...mensajes,
      ],
    });

    let texto = textoDeRespuesta(respuesta).trim();

    const descubierto = texto.includes("[DESCUBIERTO]");
    texto = texto.replace("[DESCUBIERTO]", "").trim();

    return NextResponse.json({ texto, descubierto });
  } catch (error) {
    if (esLimiteDeTasa(error)) {
      console.warn("[socratic] límite de tasa de Groq alcanzado");
      return NextResponse.json(
        { error: "Groq's per-minute limit was just reached.", codigo: "limite" },
        { status: 429 }
      );
    }

    console.error("[socratic]", error);
    return NextResponse.json(
      { error: "The tutor could not reply. Please try again." },
      { status: 500 }
    );
  }
}
