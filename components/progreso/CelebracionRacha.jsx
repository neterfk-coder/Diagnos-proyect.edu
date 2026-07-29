"use client";

import { useEffect, useState } from "react";
import { useProgreso } from "@/lib/progreso";
import { useIdioma } from "@/lib/i18n/contexto";

/** Ascuas que suben desde la llama. Posiciones fijas para no romper la hidratación. */
const ASCUAS = [
  { izq: "18%", retraso: 0, tam: 6 },
  { izq: "32%", retraso: 340, tam: 4 },
  { izq: "47%", retraso: 120, tam: 7 },
  { izq: "58%", retraso: 520, tam: 5 },
  { izq: "71%", retraso: 220, tam: 4 },
  { izq: "84%", retraso: 430, tam: 6 },
];

export default function CelebracionRacha() {
  const { t } = useIdioma();
  const { celebracion, cerrarCelebracion } = useProgreso();
  const [contador, setContador] = useState(0);

  // El número sube contando: ver el salto es parte de la recompensa
  useEffect(() => {
    if (!celebracion) return;
    setContador(Math.max(0, celebracion.dias - 1));
    const reloj = setTimeout(() => setContador(celebracion.dias), 450);
    return () => clearTimeout(reloj);
  }, [celebracion]);

  if (!celebracion) return null;

  const unidad = celebracion.dias === 1 ? t.racha.dia : t.racha.dias;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={cerrarCelebracion}
      className="fixed inset-0 z-[100] grid place-items-center bg-abismo/80 px-6 backdrop-blur-md"
    >
      <div
        className="relative w-full max-w-sm animate-crecer-racha text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Llama con ascuas subiendo */}
        <div className="relative mx-auto h-40 w-40">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ambar/30 blur-3xl"
          />
          {ASCUAS.map((a, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute bottom-6 animate-ascuas rounded-full bg-ambar"
              style={{
                left: a.izq,
                width: a.tam,
                height: a.tam,
                animationDelay: `${a.retraso}ms`,
              }}
            />
          ))}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-llama text-[6.5rem] leading-none drop-shadow-[0_0_30px_rgba(255,159,0,.65)]">
            🔥
          </span>
        </div>

        <p
          translate="no"
          className="notranslate titulo mt-4 text-6xl font-semibold tabular-nums text-ambar transition-all duration-500"
        >
          {contador}
        </p>

        <h2 className="titulo mt-2 text-2xl font-semibold text-white">
          {t.racha.subeTitulo} {celebracion.dias} {unidad} {t.racha.subeTitulo2}
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-acero">
          {celebracion.hito ? t.racha.hitoTexto : t.racha.subeTexto}
        </p>

        <button
          type="button"
          onClick={cerrarCelebracion}
          className="boton-acento mt-7"
        >
          {t.racha.seguir}
        </button>
      </div>
    </div>
  );
}
