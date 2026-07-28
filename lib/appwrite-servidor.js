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

  const conteo = {};
  for (const fila of res.rows) {
    conteo[fila.misconception] = (conteo[fila.misconception] || 0) + 1;
  }

  return {
    total: res.rows.length,
    filas: Object.entries(conteo)
      .map(([misconception, total]) => ({ misconception, total }))
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
