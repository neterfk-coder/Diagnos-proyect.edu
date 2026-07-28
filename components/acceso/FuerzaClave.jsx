"use client";

import { useIdioma } from "@/lib/i18n/contexto";

const COLORES = ["bg-ambar", "bg-ambar", "bg-acero", "bg-cobalto", "bg-cobalto"];

export function evaluarClave(clave) {
  if (!clave) return -1;
  let puntos = 0;
  if (clave.length >= 8) puntos++;
  if (clave.length >= 12) puntos++;
  if (/[A-Z]/.test(clave) && /[a-z]/.test(clave)) puntos++;
  if (/\d/.test(clave)) puntos++;
  if (/[^A-Za-z0-9]/.test(clave)) puntos++;
  return Math.min(puntos, 4);
}

/** Medidor de fuerza: cuatro barras que se llenan en cascada. */
export default function FuerzaClave({ clave }) {
  const { t } = useIdioma();
  const nivel = evaluarClave(clave);
  if (nivel < 0) return <div className="h-9" aria-hidden="true" />;

  return (
    <div className="h-9 animate-aparecer pt-1">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= nivel ? COLORES[nivel] : "bg-hielo"
              }`}
              style={{ transitionDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
        <span
          aria-live="polite"
          className="w-24 shrink-0 text-right text-[11px] font-medium uppercase tracking-etiqueta text-acero"
        >
          {t.acceso.fuerza[nivel]}
        </span>
      </div>
    </div>
  );
}
