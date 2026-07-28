"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { entrarComoInvitado } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";

/** Acceso sin cuenta: entra directo a /analizar. */
export default function BotonInvitado() {
  const router = useRouter();
  const { t } = useIdioma();
  const [entrando, setEntrando] = useState(false);

  function entrar() {
    setEntrando(true);
    entrarComoInvitado();
    setTimeout(() => router.push("/analizar"), 450);
  }

  return (
    <button type="button" onClick={entrar} disabled={entrando} className="group boton-fantasma">
      {/* Barrido de luz al pasar el ratón */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-cobalto/[0.07] to-transparent transition-all duration-700 group-hover:left-[150%]"
      />
      <span className="relative">
        {entrando ? t.acceso.invitadoEntrando : t.acceso.invitadoBoton}
      </span>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="relative transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
