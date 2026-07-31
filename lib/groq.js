import Groq from "groq-sdk";

export function clienteGroq() {
  const clave = process.env.GROQ_API_KEY;
  if (!clave) {
    throw new Error(
      "Falta GROQ_API_KEY. Copia .env.example a .env.local y añade tu clave."
    );
  }
  // El límite del tramo gratuito es por minuto: si un 429 se reintenta solo
  // vuelve a chocar con la misma ventana, y el SDK por defecto espera y
  // reintenta durante hasta un minuto antes de rendirse. Con las funciones
  // de Vercel cortando a los 60s (maxDuration), esa espera puede consumir
  // el tiempo entero de la función antes de que el error llegue al catch de
  // la ruta. Sin reintentos automáticos, un 429 falla al instante y es la
  // propia ruta la que decide qué mensaje mostrar.
  return new Groq({ apiKey: clave, maxRetries: 0 });
}

/**
 * Dos modelos, según lo que haga falta en cada ruta:
 *
 * - VISION: único con entrada de imagen en Groq. Admite JSON mode
 *   (json_object) pero no esquema estricto.
 * - TEXTO: admite json_schema con strict, así que cuando no hay foto
 *   el JSON viene garantizado por el servidor y no hay que parsear a mano.
 */
export const MODELO_VISION = "qwen/qwen3.6-27b";
export const MODELO_TEXTO = "openai/gpt-oss-120b";

/**
 * Para tareas de contexto largo (resumir un PDF entero) hace falta meter el
 * documento y una salida extensa en la MISMA petición. En el tramo gratuito
 * de Groq el límite es de tokens por minuto y varía por modelo:
 *   llama-3.3-70b  12 000 TPM   ← el más holgado
 *   gpt-oss-120b    8 000 TPM
 * Además llama no gasta tokens razonando, así que el presupuesto entero se
 * dedica al resultado.
 */
export const MODELO_LARGO = "llama-3.3-70b-versatile";

/** ¿El error de Groq es por haber superado el límite de tokens por minuto? */
export function esLimiteDeTasa(error) {
  return (
    error?.status === 429 ||
    String(error?.error?.error?.code || "") === "rate_limit_exceeded"
  );
}

/**
 * Red de seguridad: con response_format la respuesta ya debería ser JSON
 * puro, pero si un modelo la envuelve en texto o en un bloque de código,
 * esto la rescata en lugar de reventar.
 */
export function extraerJSON(texto) {
  const limpio = String(texto || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(limpio);
  } catch {
    const inicio = limpio.indexOf("{");
    const fin = limpio.lastIndexOf("}");
    if (inicio === -1 || fin === -1) {
      throw new Error("La respuesta del modelo no contiene JSON.");
    }
    return JSON.parse(limpio.slice(inicio, fin + 1));
  }
}

/** Texto de la primera opción de una respuesta de chat completions. */
export function textoDeRespuesta(respuesta) {
  return respuesta?.choices?.[0]?.message?.content ?? "";
}

/**
 * Los modelos de razonamiento fallan de vez en cuando la validación del
 * esquema estricto (json_validate_failed): gastan el presupuesto razonando
 * y devuelven JSON truncado. Pasaba ~1 de cada 5 veces.
 *
 * Aquí se reintenta una vez y, si vuelve a fallar, se baja a json_object,
 * que no valida contra esquema pero casi nunca falla. Con extraerJSON como
 * última red, el usuario ve un error solo si fallan las tres.
 */
export async function completarConEsquema(groq, opciones) {
  const esFalloDeEsquema = (error) =>
    error?.status === 400 &&
    String(error?.error?.error?.code || error?.message || "").includes(
      "json_validate_failed"
    );

  try {
    return await groq.chat.completions.create(opciones);
  } catch (error) {
    if (!esFalloDeEsquema(error)) throw error;
    console.warn("[groq] esquema estricto falló, reintentando");
  }

  try {
    return await groq.chat.completions.create(opciones);
  } catch (error) {
    if (!esFalloDeEsquema(error)) throw error;
    console.warn("[groq] segundo fallo, bajando a json_object");
  }

  return groq.chat.completions.create({
    ...opciones,
    response_format: { type: "json_object" },
  });
}
