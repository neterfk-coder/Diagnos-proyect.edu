import { NextResponse } from "next/server";
import { usuarioDesdeJWT, registrarSuperacion } from "@/lib/appwrite-servidor";
import { CODIGOS } from "@/lib/misconceptions";

export const runtime = "nodejs";

/**
 * Se llama cuando un estudiante supera los tres ejercicios de práctica sin
 * reincidir en la concepción errónea.
 *
 * El aula sale del usuario verificado por JWT, nunca del cuerpo: si no, se
 * podrían inflar los datos de una clase ajena. Sin sesión igualmente se
 * registra, pero sin aula, así no aparece en el panel de ningún docente.
 */
export async function POST(peticion) {
  try {
    const { misconception, jwt } = await peticion.json();

    if (!CODIGOS.includes(misconception)) {
      return NextResponse.json({ error: "codigo_invalido" }, { status: 400 });
    }

    const usuario = await usuarioDesdeJWT(jwt);
    await registrarSuperacion({
      misconception,
      aula: usuario?.prefs?.aula || null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[superacion]", error?.message || error);
    return NextResponse.json({ error: "generico" }, { status: 500 });
  }
}
