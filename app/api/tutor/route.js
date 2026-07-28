import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import {
  clienteGroq,
  MODELO_LARGO,
  extraerJSON,
  textoDeRespuesta,
  esLimiteDeTasa,
} from "@/lib/groq";
import { trocear } from "@/lib/troceado";

export const maxDuration = 60;
export const runtime = "nodejs";

const LENGUAS = { en: "English", es: "Spanish" };

/** Tamaño de cada trozo del documento, en caracteres (≈3 000 tokens). */
const TROZO = 12000;

/**
 * Modelos para la fase de lectura, uno por trozo y en paralelo.
 *
 * El truco está en que el límite de tokens por minuto de Groq es POR MODELO:
 * repartiendo los trozos entre modelos distintos se suman sus presupuestos
 * en lugar de agotar uno solo. Cada trozo cabe de sobra en el más ajustado.
 *
 *   gpt-oss-120b  8 000 TPM      qwen3.6-27b    8 000 TPM
 *   gpt-oss-20b   8 000 TPM      llama-3.1-8b   6 000 TPM
 *
 * `salida` va más alta en los modelos de razonamiento porque sus tokens de
 * razonamiento salen del mismo presupuesto que la respuesta.
 *
 * `esfuerzo` no es uniforme: los gpt-oss admiten low/medium/high, qwen solo
 * acepta none/default, y llama no admite el parámetro en absoluto. Mandar el
 * valor equivocado devuelve un 400 y se pierde ese trozo del documento.
 */
const LECTORES = [
  { modelo: "openai/gpt-oss-120b", salida: 1400, esfuerzo: "low" },
  { modelo: "qwen/qwen3.6-27b", salida: 1400, esfuerzo: "none" },
  { modelo: "openai/gpt-oss-20b", salida: 1400, esfuerzo: "low" },
  { modelo: "llama-3.1-8b-instant", salida: 900, esfuerzo: null },
];

/** Tantos trozos como lectores disponibles: una sola tanda en paralelo. */
const MAX_TROZOS = LECTORES.length;
const MAX_CARACTERES = TROZO * MAX_TROZOS;

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

/** Prompt de la fase de lectura: condensar un trozo sin interpretarlo. */
function sistemaLector(idioma) {
  const lengua = LENGUAS[idioma] || LENGUAS.en;

  return `You are reading ONE excerpt of a longer document, so that another model can
later build study material out of all the excerpts together.

Write dense, factual notes in ${lengua} covering everything a student would need from
this excerpt: the claims it makes, the definitions it introduces, the reasoning it
follows, the examples it gives and any errors or pitfalls it warns about.

Rules:
- Keep it under 250 words.
- Plain prose or short dashed lines. No markdown headings, no bold.
- Do not summarise away the specifics: keep names, numbers and worked examples.
- Do not add anything that is not in the excerpt, and do not comment on the excerpt
  being partial.`;
}

/**
 * Fase de lectura: cada trozo va a un modelo distinto, todos a la vez.
 * Se usa allSettled a propósito — si un modelo se queda sin cuota, se sigue
 * con las notas de los demás en vez de perder el documento entero.
 */
async function leerTrozos(groq, trozos, idioma) {
  const resultados = await Promise.allSettled(
    trozos.map((trozo, i) => {
      const lector = LECTORES[i % LECTORES.length];
      return groq.chat.completions.create({
        model: lector.modelo,
        max_completion_tokens: lector.salida,
        temperature: 0.3,
        ...(lector.esfuerzo ? { reasoning_effort: lector.esfuerzo } : {}),
        messages: [
          { role: "system", content: sistemaLector(idioma) },
          { role: "user", content: `Excerpt ${i + 1} of ${trozos.length}:\n\n${trozo}` },
        ],
      });
    })
  );

  const notas = [];
  let fallos = 0;

  resultados.forEach((r, i) => {
    if (r.status === "fulfilled") {
      const texto = textoDeRespuesta(r.value).trim();
      if (texto) notas.push(`--- Part ${i + 1} ---\n${texto}`);
      else fallos++;
    } else {
      fallos++;
      console.warn(
        `[tutor] el trozo ${i + 1} falló en ${LECTORES[i % LECTORES.length].modelo}:`,
        r.reason?.message || r.reason
      );
    }
  });

  return { notas, fallos };
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
    const lengua = LENGUAS[idioma] || LENGUAS.en;
    const groq = clienteGroq();

    const trozos = trocear(contenido, TROZO).slice(0, MAX_TROZOS);
    let fallosLectura = 0;
    let cuerpo;

    if (trozos.length <= 1) {
      // Documento corto: va entero al modelo grande. Menos pasos y mejor
      // resultado que resumir un resumen.
      cuerpo = `Document text:\n\n${trozos[0] || contenido}`;
    } else {
      // Documento largo: se lee por partes en paralelo y luego se sintetiza.
      const { notas, fallos } = await leerTrozos(groq, trozos, idioma);
      fallosLectura = fallos;

      if (notas.length === 0) {
        return NextResponse.json(
          {
            error: "The document could not be read. Please try again in a minute.",
            codigo: "limite",
          },
          { status: 429 }
        );
      }

      cuerpo = `The document was read in ${trozos.length} parts. These are the notes from each part, in order:\n\n${notas.join(
        "\n\n"
      )}`;
    }

    const respuesta = await groq.chat.completions.create({
      model: MODELO_LARGO,
      max_completion_tokens: 4000,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sistema(idioma) },
        {
          role: "user",
          content: `${cuerpo}\n\n---\nProduce the study material in ${lengua}: 6 key points, 8 flashcards, 4 exercises. Treat the parts as one single document.`,
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
      meta: {
        paginas,
        caracteres: contenido.length,
        recortado,
        partes: trozos.length,
        partesFallidas: fallosLectura,
      },
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
