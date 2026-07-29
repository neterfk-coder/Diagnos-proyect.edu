"use client";

import { useEffect, useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";

/**
 * Pantalla de análisis.
 *
 * Las dos primeras fases son reales: el navegador ya extrajo el texto, así
 * que sabemos las páginas y los caracteres exactos. Las dos últimas ocurren
 * en el servidor, donde no hay progreso que consultar, así que avanzan por
 * tiempo. Se distingue a propósito: enseñar cifras inventadas sería peor que
 * no enseñar ninguna.
 */
export default function AnalizandoPdf({ paginas, caracteres, partes }) {
  const { t } = useIdioma();
  const [fase, setFase] = useState(2); // las dos primeras ya están hechas

  useEffect(() => {
    const reloj = setInterval(() => setFase((f) => Math.min(f + 1, 3)), 3800);
    return () => clearInterval(reloj);
  }, []);

  const fases = [
    { texto: t.tutor.faseLeer, dato: paginas ? `${paginas} ${t.tutor.paginas}` : null },
    {
      texto: t.tutor.faseExtraer,
      dato: caracteres ? `${caracteres.toLocaleString()} ${t.tutor.caracteres}` : null,
    },
    {
      texto: t.tutor.faseAnalizar,
      dato: partes > 1 ? `${partes} ${t.tutor.partes}` : null,
    },
    { texto: t.tutor.faseRedactar, dato: null },
  ];

  return (
    <div className="tarjeta mt-6 overflow-hidden">
      {/* Documento con la línea de escaneo */}
      <div className="relative grid place-items-center border-b border-hielo bg-abismo/40 py-10">
        <div className="relative h-28 w-24">
          {/* Hoja */}
          <div className="absolute inset-0 rounded-xl border border-hielo bg-papel/80" />
          {/* Renglones */}
          <div className="absolute inset-x-4 top-5 space-y-2.5">
            {[100, 82, 92, 68, 88, 74].map((w, i) => (
              <div
                key={i}
                className="h-1 rounded-full bg-hielo"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          {/* Barrido */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 h-12 animate-escanear bg-gradient-to-b from-transparent via-ambar/40 to-transparent"
            />
          </div>
          {/* Filo brillante */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 h-px animate-escanear bg-ambar shadow-naranja"
          />
        </div>
      </div>

      {/* Fases */}
      <ol className="space-y-3 p-6">
        {fases.map((f, i) => {
          const hecha = i < fase;
          const activa = i === fase;
          return (
            <li key={f.texto} className="flex items-center gap-3">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                  hecha
                    ? "border-ambar bg-ambar text-abismo"
                    : activa
                    ? "border-ambar text-ambar"
                    : "border-hielo text-acero/40"
                }`}
              >
                {hecha ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path
                      d="m4 12.5 5.2 5.2L20 7"
                      className="animate-dibujar-trazo"
                      style={{ strokeDasharray: 32 }}
                    />
                  </svg>
                ) : activa ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="animate-girar"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeOpacity="0.3"
                      strokeWidth="3"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>

              <span
                className={`text-sm transition-colors duration-500 ${
                  hecha || activa ? "text-tinta" : "text-acero/50"
                }`}
              >
                {f.texto}
              </span>

              {f.dato && (hecha || activa) && (
                <span
                  translate="no"
                  className="notranslate ml-auto shrink-0 rounded-full bg-ambar/15 px-2.5 py-0.5 font-mono text-[11px] text-ambar"
                >
                  {f.dato}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
