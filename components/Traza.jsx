"use client";

import { useIdioma } from "@/lib/i18n/contexto";

/**
 * La Traza — firma visual de Diagnos.
 * Recorre los pasos del razonamiento del estudiante como una línea vertical.
 * El paso donde se rompe el razonamiento late en ámbar; el resto queda en calma.
 */
export default function Traza({ pasos = [], pasoRoto = null, compacta = false }) {
  const { t } = useIdioma();

  return (
    <ol className="traza flex flex-col gap-4">
      {pasos.map((paso) => {
        const esError = paso.estado === "erroneo";
        const esArrastrado = paso.estado === "arrastrado";
        return (
          <li key={paso.n} className="relative animate-aparecer" style={{ animationDelay: `${paso.n * 120}ms` }}>
            <span
              className={`traza-punto notranslate ${
                esError ? "traza-punto-error" : esArrastrado ? "" : "traza-punto-ok"
              }`}
              aria-hidden="true"
              translate="no"
            >
              {esError ? "!" : paso.n}
            </span>
            <div className={compacta ? "" : "pb-1"}>
              {/* Los pasos son notación matemática: traducirlos no tiene
                  sentido y además rompería la hidratación. */}
              <p
                translate="no"
                className={`notranslate font-mono text-[15px] leading-relaxed ${
                  esError
                    ? "font-medium text-tinta"
                    : esArrastrado
                    ? "text-acero line-through decoration-hielo"
                    : "text-tinta"
                }`}
              >
                {paso.texto}
              </p>
              {esError && (
                <p className="mt-1 text-xs font-medium uppercase tracking-etiqueta text-ambar">
                  {t.traza.aqui}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
