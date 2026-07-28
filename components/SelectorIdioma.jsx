"use client";

import { useIdioma, IDIOMAS } from "@/lib/i18n/contexto";

/**
 * Conmutador EN/ES con pastilla deslizante.
 * Dos idiomas nada más, así que un desplegable sobraría: se ve el estado
 * y se cambia de un clic.
 */
export default function SelectorIdioma({ claro = false }) {
  const { idioma, cambiarIdioma, t } = useIdioma();
  const indice = IDIOMAS.findIndex((i) => i.codigo === idioma);

  return (
    <div
      role="group"
      aria-label={t.nav.idioma}
      className={`relative flex rounded-full border p-0.5 ${
        claro ? "border-white/20 bg-white/10" : "border-hielo bg-nube"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          claro ? "bg-white/25" : "bg-papel shadow-suave"
        }`}
        style={{ transform: `translateX(${indice * 100}%)` }}
      />
      {IDIOMAS.map((i) => {
        const activo = i.codigo === idioma;
        return (
          <button
            key={i.codigo}
            type="button"
            onClick={() => cambiarIdioma(i.codigo)}
            aria-pressed={activo}
            title={i.nombre}
            translate="no"
            className={`notranslate relative z-10 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-etiqueta transition-colors duration-300 ${
              claro
                ? activo
                  ? "text-white"
                  : "text-bruma hover:text-white"
                : activo
                ? "text-tinta"
                : "text-acero hover:text-tinta"
            }`}
          >
            {i.corto}
          </button>
        );
      })}
    </div>
  );
}
