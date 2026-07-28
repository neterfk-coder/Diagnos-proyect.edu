import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import {
  clienteGroq,
  MODELO_LARGO,
  extraerJSON,
  textoDeRespuesta,
  esLimiteDeTasa,
} from "@/lib/groq";

export const maxDuration = 60;
export const runtime = "nodejs";

const LENGUAS = { en: "English", es: "Spanish" };

/**
 * Tope de texto que se manda al modelo. Un PDF largo se recorta.
 * 16 000 caracteres ≈ 4 000 tokens; sumados al sistema y a los 4 000 de
 * salida quedan ~8 600, con margen bajo los 12 000 TPM del tramo gratuito.
 */
const MAX_CARACTERES = 16000;
/** Tope del PDF en bytes (~12 MB), antes de decodificar. */
const MAX_BYTES = 12 * 1024 * 1024;

function sistema(idioma) {
  const lengua = LENGUAS[idioma] || LENGUAS.en;

  return `OUTPUT LANGUAGE: ${lengua}. Every string you produce — title, summary,
key points, flashcards and exercises — MUST be written in ${lengua}, regardless of
the language of the source document.

You are the study tutor of Diagnos. You receive the text of a document a student
needs to learn, and you turn it into study material.

Reply with ONE JSON object, nothing else, exactly in this shape:

{
  "titulo": "a short concrete title for the document",
  "resumen": "3 to 5 paragraphs separated by \\n\\n",
  "puntosClave": [ { "titulo": "...", "detalle": "..." } ],
  "flashcards": [ { "anverso": "...", "reverso": "..." } ],
  "ejercicios": [ { "enunciado": "...", "pista": "..." } ]
}

Content rules:
- "titulo": name what the document is about. Never "Summary" or "Document".
- "resumen": a genuinely elaborated summary that follows the document's line of
  reasoning and explains why it matters. Do not list section headings back; write
  prose a student can actually learn from. Separate paragraphs with \\n\\n.
- "puntosClave": EXACTLY 6 entries. "titulo" of at most 6 words, "detalle" of 1-2
  sentences. These are the ideas that must survive if everything else is forgotten.
- "flashcards": EXACTLY 8 entries. "anverso" is a question or a term; "reverso" is
  the answer in at most 3 sentences. Test understanding, not trivia.
- "ejercicios": EXACTLY 4 entries. "enunciado" asks the student to apply or reason
  with the content; "pista" points at what to notice WITHOUT solving it.

Hard rules:
- Ground everything strictly in the document. Never invent facts that are not in the
  text. If the text is too short or unreadable, say so in "resumen" and keep the
  other arrays short rather than making things up.
- Plain prose inside the strings: no markdown, no asterisks, no headings.
- Respect the counts: 6, 8 and 4. Do not return a single-element array.

Final reminder: everything in ${lengua}, valid JSON, and the counts are 6 key
points, 8 flashcards and 4 exercises.`;
}

/** Normaliza lo que devuelva el modelo para que la interfaz nunca reviente. */
function normalizar(d) {
  const lista = (v) => (Array.isArray(v) ? v : []);
  return {
    titulo: typeof d?.titulo === "string" ? d.titulo : "",
    resumen: typeof d?.resumen === "string" ? d.resumen : "",
    puntosClave: lista(d?.puntosClave).filter((p) => p?.titulo || p?.detalle),
    flashcards: lista(d?.flashcards).filter((f) => f?.anverso && f?.reverso),
    ejercicios: lista(d?.ejercicios).filter((e) => e?.enunciado),
  };
}

export async function POST(peticion) {
  try {
    const { pdfBase64, texto, idioma } = await peticion.json();

    if (!pdfBase64 && !texto?.trim()) {
      return NextResponse.json(
        { error: "Send a PDF or paste some text." },
        { status: 400 }
      );
    }

    let contenido = (texto || "").trim();
    let paginas = 0;

    if (pdfBase64) {
      if (pdfBase64.length * 0.75 > MAX_BYTES) {
        return NextResponse.json(
          { error: "That PDF is too large. The limit is 12 MB.", codigo: "grande" },
          { status: 413 }
        );
      }

      const bytes = Buffer.from(pdfBase64, "base64");
      let pdf;
      try {
        pdf = await getDocumentProxy(new Uint8Array(bytes));
      } catch {
        return NextResponse.json(
          { error: "That file could not be read as a PDF.", codigo: "ilegible" },
          { status: 400 }
        );
      }

      const extraido = await extractText(pdf, { mergePages: true });
      paginas = extraido.totalPages || 0;
      contenido = String(extraido.text || "").trim();
    }

    // Un PDF escaneado sin capa de texto extrae casi nada: hay que decirlo
    // en vez de mandar cuatro caracteres al modelo y devolver un invento.
    if (contenido.length < 200) {
      return NextResponse.json(
        {
          error:
            "Almost no text could be extracted. If the PDF is a scan, it has no text layer.",
          codigo: "sin_texto",
        },
        { status: 422 }
      );
    }

    const recortado = contenido.length > MAX_CARACTERES;
    const material = contenido.slice(0, MAX_CARACTERES);
    const lengua = LENGUAS[idioma] || LENGUAS.en;

    const groq = clienteGroq();
    const respuesta = await groq.chat.completions.create({
      model: MODELO_LARGO,
      max_completion_tokens: 4000,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sistema(idioma) },
        {
          role: "user",
          content: `Document text:\n\n${material}\n\n---\nProduce the study material in ${lengua}: 6 key points, 8 flashcards, 4 exercises.`,
        },
      ],
    });

    const datos = normalizar(extraerJSON(textoDeRespuesta(respuesta)));

    if (datos.flashcards.length === 0 && datos.puntosClave.length === 0) {
      return NextResponse.json(
        { error: "No usable study material came back. Please try again.", codigo: "vacio" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ...datos,
      meta: { paginas, caracteres: contenido.length, recortado },
    });
  } catch (error) {
    // El tramo gratuito de Groq limita tokens por minuto: conviene decirlo
    // con claridad en vez de mostrar un error genérico.
    if (esLimiteDeTasa(error)) {
      console.warn("[tutor] límite de tasa de Groq alcanzado");
      return NextResponse.json(
        {
          error:
            "The Groq per-minute token limit was reached. Wait a minute and try again, or use a shorter document.",
          codigo: "limite",
        },
        { status: 429 }
      );
    }

    console.error("[tutor]", error);
    return NextResponse.json(
      { error: "The study material could not be generated. Please try again." },
      { status: 500 }
    );
  }
}
