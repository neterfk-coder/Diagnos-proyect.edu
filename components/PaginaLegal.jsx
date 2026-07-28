"use client";

import CabeceraPagina from "@/components/CabeceraPagina";
import RevelarAlScroll from "@/components/RevelarAlScroll";

/**
 * Estructura común de las páginas legales: cabecera, índice lateral pegajoso
 * y secciones numeradas con anclas propias.
 */
export default function PaginaLegal({ contenido }) {
  const secciones = contenido.secciones.map((s, i) => ({
    ...s,
    ancla: s.id || `seccion-${i + 1}`,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <CabeceraPagina
        etiqueta={contenido.etiqueta}
        titulo={contenido.titulo}
        meta={contenido.actualizado}
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
        {/* Índice */}
        <nav className="lg:sticky lg:top-24 lg:self-start" aria-label={contenido.titulo}>
          <ol className="space-y-2 border-l border-hielo pl-4 text-sm">
            {secciones.map((s, i) => (
              <li key={s.ancla}>
                <a
                  href={`#${s.ancla}`}
                  className="group flex gap-2 text-acero transition-colors hover:text-cobalto"
                >
                  <span className="font-mono text-xs text-hielo transition-colors group-hover:text-cobalto">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-snug">{s.titulo}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Secciones */}
        <div className="space-y-12">
          {secciones.map((s, i) => (
            <RevelarAlScroll
              as="section"
              key={s.ancla}
              id={s.ancla}
              className="scroll-mt-24"
            >
              <h2 className="titulo flex items-baseline gap-3 text-xl font-semibold text-tinta">
                <span className="font-mono text-xs text-cobalto">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.titulo}
              </h2>
              <div className="mt-3 space-y-3.5">
                {s.parrafos.map((p) => (
                  <p key={p} className="text-sm font-light leading-relaxed text-acero">
                    {p}
                  </p>
                ))}
              </div>
            </RevelarAlScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
