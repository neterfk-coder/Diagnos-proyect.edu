import { NextResponse } from "next/server";
import { usuarioDesdeJWT, resumenDeAula } from "@/lib/appwrite-servidor";

export const runtime = "nodejs";

/** Mismo cálculo que en el cliente, para no depender de lo que envíe. */
function codigoDeAula(id) {
  return String(id || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase();
}

/**
 * Resumen del aula del docente autenticado.
 *
 * Toda la comprobación ocurre aquí: quién eres sale del JWT firmado por
 * Appwrite, y el aula sale de tus preferencias. El cliente no elige nada,
 * así que no puede pedir los datos de otra clase.
 */
export async function POST(peticion) {
  try {
    const { jwt } = await peticion.json();

    const usuario = await usuarioDesdeJWT(jwt);
    if (!usuario) {
      return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
    }

    if (usuario.prefs?.rol !== "docente") {
      return NextResponse.json({ error: "no_docente" }, { status: 403 });
    }

    const aula = usuario.prefs?.aula || codigoDeAula(usuario.$id);
    const resumen = await resumenDeAula(aula);

    if (!resumen) {
      return NextResponse.json({ error: "sin_base_datos" }, { status: 503 });
    }

    return NextResponse.json({ aula, ...resumen });
  } catch (error) {
    console.error("[aula]", error);
    return NextResponse.json({ error: "generico" }, { status: 500 });
  }
}
