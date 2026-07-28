import { Client, TablesDB, ID } from "node-appwrite";

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
        aula: aula || "demo",
      },
    });
  } catch (error) {
    console.error("[appwrite] no se pudo registrar el diagnóstico:", error?.message || error);
  }
}
