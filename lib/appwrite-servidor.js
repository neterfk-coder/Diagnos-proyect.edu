import { Client, TablesDB, Account, Query, ID } from "node-appwrite";

const BASE_DATOS = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const TABLA_DIAGNOSTICOS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_DIAGNOSTICOS || "diagnosticos";

/**
 * Cliente de Appwrite para el servidor (con API key).
 * Solo usar dentro de rutas de API: la API key omite los permisos
 * de la tabla, igual que hacía la service role key antes.
 */
function appwriteServidor() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const proyecto = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const clave = process.env.APPWRITE_API_KEY;
  if (!endpoint || !proyecto || !clave || !BASE_DATOS) return null;

  const cliente = new Client()
    .setEndpoint(endpoint)
    .setProject(proyecto)
    .setKey(clave);
  return new TablesDB(cliente);
}

const TABLA_MENSAJES = process.env.APPWRITE_TABLE_MENSAJES || "mensajes";
const TABLA_SUPERACIONES =
  process.env.APPWRITE_TABLE_SUPERACIONES || "superaciones";

/**
 * Registra que alguien superó una concepción errónea.
 *
 * Sin identificador de usuario, igual que los diagnósticos: al docente le
 * sirve el recuento y la política de privacidad promete anonimato. Nunca
 * lanza — perder este registro no debe estropear la celebración que el
 * estudiante acaba de ganarse.
 */
export async function registrarSuperacion({ misconception, aula }) {
  const bd = appwriteServidor();
  if (!bd || !misconception) return;

  try {
    await bd.createRow({
      databaseId: BASE_DATOS,
      tableId: TABLA_SUPERACIONES,
      rowId: ID.unique(),
      data: { misconception, aula: aula || "sin-aula" },
    });
  } catch (error) {
    console.error("[appwrite] no se pudo registrar la superación:", error?.message);
  }
}

/**
 * Guarda un mensaje del formulario de contacto.
 * Lanza si falla: aquí sí importa, porque el usuario espera confirmación de
 * que su mensaje llegó. Decirle que sí cuando se perdió sería mentirle.
 */
export async function guardarMensaje({ nombre, correo, asunto, mensaje, idioma }) {
  const bd = appwriteServidor();
  if (!bd) throw new Error("sin_base_datos");

  return bd.createRow({
    databaseId: BASE_DATOS,
    tableId: TABLA_MENSAJES,
    rowId: ID.unique(),
    data: { nombre, correo, asunto, mensaje, idioma: idioma || "en" },
  });
}

/**
 * Identifica al usuario a partir de un JWT emitido por el navegador.
 *
 * Es lo que permite que el servidor sepa QUIÉN pregunta sin fiarse de lo que
 * le mande el cliente: el token lo firma Appwrite, no la página. Devuelve
 * null si no hay token o si ya caducó.
 */
export async function usuarioDesdeJWT(jwt) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const proyecto = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!jwt || !endpoint || !proyecto) return null;

  try {
    const cliente = new Client()
      .setEndpoint(endpoint)
      .setProject(proyecto)
      .setJWT(jwt);
    return await new Account(cliente).get();
  } catch {
    return null;
  }
}

/**
 * Recuento de concepciones erróneas de un aula.
 * La consulta la hace el servidor con la API key y el aula sale de la
 * identidad verificada, así que un usuario no puede pedir los datos de
 * otra clase cambiando un parámetro.
 */
export async function resumenDeAula(aula) {
  const bd = appwriteServidor();
  if (!bd || !aula) return null;

  const res = await bd.listRows({
    databaseId: BASE_DATOS,
    tableId: TABLA_DIAGNOSTICOS,
    queries: [
      Query.equal("aula", aula),
      Query.orderDesc("$createdAt"),
      Query.limit(1000),
    ],
  });

  // Superaciones del mismo aula: es lo que convierte el mapa de calor en
  // evidencia de aprendizaje y no solo en un inventario de errores.
  let superadas = {};
  let totalSuperadas = 0;
  try {
    const sup = await bd.listRows({
      databaseId: BASE_DATOS,
      tableId: TABLA_SUPERACIONES,
      queries: [Query.equal("aula", aula), Query.limit(1000)],
    });
    totalSuperadas = sup.rows.length;
    for (const fila of sup.rows) {
      superadas[fila.misconception] = (superadas[fila.misconception] || 0) + 1;
    }
  } catch (error) {
    // Si la tabla aún no existe el panel sigue funcionando sin esta columna
    console.warn("[appwrite] superaciones no disponibles:", error?.message);
  }

  const conteo = {};
  for (const fila of res.rows) {
    conteo[fila.misconception] = (conteo[fila.misconception] || 0) + 1;
  }

  return {
    total: res.rows.length,
    totalSuperadas,
    filas: Object.entries(conteo)
      .map(([misconception, total]) => ({
        misconception,
        total,
        superadas: superadas[misconception] || 0,
      }))
      .sort((a, b) => b.total - a.total),
  };
}

/**
 * Registra un diagnóstico anónimo para el panel docente.
 * Nunca lanza: si la base de datos falla, el diagnóstico del estudiante
 * se devuelve igual. El registro es un extra, no un requisito.
 */
export async function registrarDiagnostico({ ejercicio, misconception, paso_roto, aula }) {
  const bd = appwriteServidor();
  if (!bd) return;

  try {
    await bd.createRow({
      databaseId: BASE_DATOS,
      tableId: TABLA_DIAGNOSTICOS,
      rowId: ID.unique(),
      data: {
        ejercicio,
        misconception,
        paso_roto: paso_roto ?? null,
        // Sin sesión no hay aula. Se marca explícitamente en vez de dejar
        // que la columna aplique su valor por defecto, para que estos
        // diagnósticos no aparezcan en el panel de ningún docente.
        aula: aula || "sin-aula",
      },
    });
  } catch (error) {
    console.error("[appwrite] no se pudo registrar el diagnóstico:", error?.message || error);
  }
}
