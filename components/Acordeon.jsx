"use client";

import { useState } from "react";

/**
 * Lista de preguntas plegables. Una abierta a la vez: obliga a leer una
 * respuesta antes de saltar a la siguiente.
 */
export default function Acordeon({ elementos = [] }) {
  const [abierto, setAbierto] = useState(0);

  return (
    <div className="divide-y divide-hielo overflow-hidden rounded-2xl border border-hielo bg-papel">
      {elementos.map((el, i) => {
        const activo = abierto === i;
        return (
          <div key={el.p}>
            <h3>
              <button
                type="button"
                onClick={() => setAbierto(activo ? -1 : i)}
                aria-expanded={activo}
                className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-colors hover:bg-nube"
              >
                <span
                  className={`text-[15px] font-medium transition-colors ${
                    activo ? "text-cobalto" : "text-tinta"
                  }`}
                >
                  {el.p}
                </span>
                <span
                  aria-hidden="true"
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                    activo
                      ? "rotate-45 border-electrico bg-electrico text-abismo"
                      : "border-hielo text-acero"
                  }`}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>

            {/* La rejilla 0fr→1fr permite animar una altura desconocida */}
            <div
              className={`grid transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                activo ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-acero">
                  {el.r}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
