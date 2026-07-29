import { NextResponse } from "next/server";
import { guardarMensaje } from "@/lib/appwrite-servidor";

export const runtime = "nodejs";

/** Topes alineados con el tamaño de las columnas de la tabla. */
const TOPES = { nombre: 120, correo: 160, asunto: 200, mensaje: 4000 };

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(peticion) {
  try {
    const { nombre, correo, asunto, mensaje, idioma, web } = await peticion.json();

    // Trampa para bots: el campo "web" está oculto por CSS, así que una
    // persona nunca lo rellena. Se responde 200 para no darles pistas.
    if (web) return NextResponse.json({ ok: true });

    const limpio = {
      nombre: String(nombre || "").trim(),
      correo: String(correo || "").trim(),
      asunto: String(asunto || "").trim(),
      mensaje: String(mensaje || "").trim(),
    };

    if (!limpio.nombre || !limpio.asunto || !limpio.mensaje) {
      return NextResponse.json({ error: "faltan_campos" }, { status: 400 });
    }
    if (!CORREO_VALIDO.test(limpio.correo)) {
      return NextResponse.json({ error: "correo_invalido" }, { status: 400 });
    }

    // Se recorta en vez de rechazar: perder un mensaje largo por pasarse de
    // unos caracteres sería peor que guardarlo truncado.
    for (const [campo, tope] of Object.entries(TOPES)) {
      if (limpio[campo].length > tope) limpio[campo] = limpio[campo].slice(0, tope);
    }

    await guardarMensaje({ ...limpio, idioma });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contacto]", error?.message || error);
    return NextResponse.json({ error: "generico" }, { status: 500 });
  }
}
