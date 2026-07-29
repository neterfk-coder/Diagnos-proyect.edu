"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTutorial } from "@/lib/tutorial";
import { useIdioma } from "@/lib/i18n/contexto";

/** Distancia mínima de arrastre para que cuente como deslizamiento. */
const UMBRAL_DESLIZ = 55;

export default function Tutorial() {
  const { abierto, cerrar } = useTutorial();
  const { t } = useIdioma();
  const fichas = t.tutorial.fichas;

  const [indice, setIndice] = useState(0);
  const inicioTactil = useRef(null);

  const ultima = indice === fichas.length - 1;

  const ir = useCallback(
    (siguiente) => {
      setIndice((i) => Math.min(fichas.length - 1, Math.max(0, siguiente)));
    },
    [fichas.length]
  );

  // Se reinicia al abrirlo para que reabrirlo desde ayuda empiece por el principio
  useEffect(() => {
    if (abierto) setIndice(0);
  }, [abierto]);

  // Teclado: flechas para navegar, Escape para salir
  useEffect(() => {
    if (!abierto) return;
    function alPulsar(e) {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowRight") ir(indice + 1);
      else if (e.key === "ArrowLeft") ir(indice - 1);
    }
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto, indice, ir, cerrar]);

  // Mientras está abierto no se debe poder desplazar la página de detrás
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  if (!abierto) return null;

  function alSoltar(x) {
    if (inicioTactil.current === null) return;
    const recorrido = inicioTactil.current - x;
    if (Math.abs(recorrido) > UMBRAL_DESLIZ) {
      ir(indice + (recorrido > 0 ? 1 : -1));
    }
    inicioTactil.current = null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.tutorial.aria}
      className="fixed inset-0 z-[110] grid place-items-center bg-abismo/85 px-5 py-8 backdrop-blur-md"
    >
      <div className="w-full max-w-lg">
        {/* Progreso */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-hielo">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ambar to-ambarVivo transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${((indice + 1) / fichas.length) * 100}%` }}
            />
          </div>
          <span
            translate="no"
            className="notranslate shrink-0 font-mono text-xs tabular-nums text-acero"
          >
            {indice + 1}/{fichas.length}
          </span>
        </div>

        {/* Carrusel */}
        <div
          className="tarjeta overflow-hidden !shadow-tarjeta"
          onTouchStart={(e) => (inicioTactil.current = e.touches[0].clientX)}
          onTouchEnd={(e) => alSoltar(e.changedTouches[0].clientX)}
          onMouseDown={(e) => (inicioTactil.current = e.clientX)}
          onMouseUp={(e) => alSoltar(e.clientX)}
        >
          <div
            className="flex transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${indice * 100}%)` }}
          >
            {fichas.map((f, i) => (
              <div
                key={f.titulo}
                aria-hidden={i !== indice}
                className="w-full shrink-0 select-none px-7 py-9 text-center sm:px-10 sm:py-11"
              >
                <span
                  className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-ambar/15 text-4xl"
                  style={{
                    // Solo se anima el contenido de la ficha visible
                    animation:
                      i === indice
                        ? "brotar .55s cubic-bezier(0.34,1.56,0.64,1) both"
                        : "none",
                  }}
                >
                  {f.icono}
                </span>

                <p className="etiqueta-acento mt-6">{f.etiqueta}</p>
                <h2 className="titulo mt-2 text-2xl font-semibold leading-snug text-white sm:text-3xl">
                  {f.titulo}
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-acero">
                  {f.texto}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Puntos */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {fichas.map((f, i) => (
            <button
              key={f.titulo}
              type="button"
              onClick={() => ir(i)}
              aria-label={`${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === indice ? "w-7 bg-ambar" : "w-1.5 bg-hielo hover:bg-acero"
              }`}
            />
          ))}
        </div>

        {/* Controles */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={cerrar}
            className="text-sm text-acero transition-colors hover:text-tinta"
          >
            {ultima ? "" : t.tutorial.saltar}
          </button>

          <div className="flex items-center gap-2">
            {indice > 0 && (
              <button
                type="button"
                onClick={() => ir(indice - 1)}
                className="boton-secundario !px-5 !py-2.5 text-xs"
              >
                {t.tutorial.anterior}
              </button>
            )}
            <button
              type="button"
              onClick={() => (ultima ? cerrar() : ir(indice + 1))}
              className="boton-primario !px-6 !py-2.5 text-xs"
            >
              {ultima ? t.tutorial.empezar : t.tutorial.siguiente}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
