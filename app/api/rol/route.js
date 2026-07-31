import { NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";

/**
 * Único camino para convertirse en docente.
 *
 * updatePrefs() está al alcance de cualquier usuario autenticado para su
 * propia cuenta, así que ponerse "docente" a mano desde el cliente era un
 * único clic sin ninguna verificación. Aquí el rol solo se escribe si el
 * código coincide con el secreto del servidor — el cliente nunca decide su
 * propio rol, igual que el aula nunca sale de lo que manda la petición en
 * el resto de rutas.
 */
export async function POST(peticion) {
  try {
    const { jwt, codigo } = await peticion.json();

    const secreto = process.env.CODIGO_DOCENTE;
    if (!secreto) {
      return NextResponse.json({ error: "sin_configurar" }, { status: 501 });
    }
    if (!jwt) {
      return NextResponse.json({ error: "sin_sesion" }, { status: 401 });
    }
    if (String(codigo || "") !== secreto) {
      return NextResponse.json({ error: "codigo_invalido" }, { status: 403 });
    }

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const proyecto = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const cliente = new Client().setEndpoint(endpoint).setProject(proyecto).setJWT(jwt);
    const cuenta = new Account(cliente);

    const usuario = await cuenta.get();
    await cuenta.updatePrefs({ ...usuario.prefs, rol: "docente" });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[rol]", error);
    return NextResponse.json({ error: "no_se_pudo" }, { status: 500 });
  }
}
