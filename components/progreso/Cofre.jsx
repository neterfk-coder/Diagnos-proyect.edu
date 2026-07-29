"use client";

import { useEffect, useState } from "react";
import { useProgreso, COLORES_RAREZA } from "@/lib/progreso";
import { useIdioma } from "@/lib/i18n/contexto";

/** Chispas que salen disparadas al abrirse. Direcciones fijas y repartidas. */
const CHISPAS = Array.from({ length: 14 }, (_, i) => {
  const angulo = (i / 14) * Math.PI * 2;
  return {
    dx: `${Math.cos(angulo) * 150}px`,
    dy: `${Math.sin(angulo) * 150}px`,
    retraso: (i % 5) * 60,
  };
});

export default function Cofre({ abierto, onCerrar }) {
  const { t } = useIdioma();
  const { abrirCofre, pegatinas } = useProgreso();
  const [fase, setFase] = useState("reposo"); // reposo | temblando | premio
  const [premio, setPremio] = useState(null);
  const [repetida, setRepetida] = useState(false);

  useEffect(() => {
    if (!abierto) {
      setFase("reposo");
      setPremio(null);
    }
  }, [abierto]);

  if (!abierto) return null;

  function abrir() {
    if (fase !== "reposo") return;
    setFase("temblando");
    // El temblor dura 1,2 s: el premio se revela justo al terminar
    setTimeout(() => {
      const yaLaTenia = [...pegatinas];
      const nuevo = abrirCofre();
      if (nuevo) {
        setPremio(nuevo);
        setRepetida(yaLaTenia.includes(nuevo.id));
      }
      setFase("premio");
    }, 1200);
  }

  const colores = premio ? COLORES_RAREZA[premio.rareza] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-abismo/80 px-6 backdrop-blur-md"
      onClick={fase === "premio" ? onCerrar : undefined}
    >
      <div
        className="relative w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {fase !== "premio" ? (
          <>
            <button
              type="button"
              onClick={abrir}
              disabled={fase === "temblando"}
              aria-label={t.progreso.cofreAbrir}
              className="relative mx-auto block"
            >
              {/* Halo de fondo */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ambar/25 blur-3xl"
              />
              <span
                className={`relative block text-[7rem] leading-none drop-shadow-[0_0_35px_rgba(255,159,0,.6)] ${
                  fase === "temblando"
                    ? "animate-temblar-cofre"
                    : "animate-latido-cofre"
                }`}
              >
                🎁
              </span>
            </button>

            <p className="titulo mt-6 text-3xl font-semibold text-white">
              {fase === "temblando" ? t.progreso.abriendo : t.progreso.cofreListo}
            </p>

            {fase === "reposo" && (
              <button type="button" onClick={abrir} className="boton-acento mt-6">
                {t.progreso.cofreAbrir}
              </button>
            )}
          </>
        ) : (
          <>
            {/* Estallido */}
            <div className="relative mx-auto h-44 w-44" aria-hidden="true">
              {CHISPAS.map((c, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-2 w-2 animate-estallar rounded-full bg-ambar"
                  style={{
                    "--dx": c.dx,
                    "--dy": c.dy,
                    animationDelay: `${c.retraso}ms`,
                  }}
                />
              ))}

              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{
                  width: "11rem",
                  height: "11rem",
                  background: colores?.halo,
                }}
              />

              <span
                className={`absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-revelar-premio place-items-center rounded-3xl border-2 bg-papel text-6xl ${colores?.borde}`}
              >
                {premio?.emoji}
              </span>
            </div>

            <p className={`etiqueta mt-6 ${colores?.texto}`}>
              {t.progreso.rarezas[premio?.rareza]}
            </p>
            <p className="titulo mt-1 text-3xl font-semibold text-white">
              {t.progreso.pegatinas[premio?.id]}
            </p>
            <p className="mt-2 text-sm text-acero">
              {repetida ? t.progreso.premioRepetida : t.progreso.premioTitulo}
            </p>

            <button type="button" onClick={onCerrar} className="boton-acento mt-7">
              {t.progreso.premioCerrar}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
