import { Client, TablesDB } from "appwrite";

export const BASE_DATOS = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export const TABLA_DIAGNOSTICOS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_DIAGNOSTICOS || "diagnosticos";

/**
 * Cliente de Appwrite para el navegador (solo endpoint + proyecto).
 * Devuelve null si las variables de entorno no están configuradas,
 * para que la app funcione en modo demostración sin base de datos.
 */
export function clienteAppwrite() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const proyecto = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!endpoint || !proyecto || !BASE_DATOS) return null;

  const cliente = new Client().setEndpoint(endpoint).setProject(proyecto);
  return new TablesDB(cliente);
}

export { Query } from "appwrite";
