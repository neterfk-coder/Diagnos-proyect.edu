"use client";

import Link from "next/link";
import { useIdioma } from "@/lib/i18n/contexto";

/** Cabecera común de las páginas de contenido: etiqueta, título y entradilla. */
export default function CabeceraPagina({ etiqueta, titulo, entrada, meta }) {
  const { t } = useIdioma();

  return (
    <header className="animate-aparecer">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-acero transition-colors hover:text-cobalto"
      >
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
          className="transition-transform duration-300 group-hover:-translate-x-1"
        >
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        {t.paginas.volver}
      </Link>

      <p className="etiqueta mt-8">{etiqueta}</p>
      <h1 className="titulo mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
        {titulo}
      </h1>
      {entrada && (
        <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-acero">
          {entrada}
        </p>
      )}
      {meta && <p className="mt-4 font-mono text-xs text-acero">{meta}</p>}
    </header>
  );
}
