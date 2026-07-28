"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Pestañas con subrayado deslizante.
 * El indicador se mide del botón activo en vez de repartirse a partes
 * iguales, porque las etiquetas tienen anchos muy distintos entre idiomas.
 */
export default function Pestanas({ opciones, activa, onCambiar }) {
  const refs = useRef([]);
  const [barra, setBarra] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const nodo = refs.current[activa];
    if (nodo) setBarra({ left: nodo.offsetLeft, width: nodo.offsetWidth });
  }, [activa, opciones]);

  return (
    <div
      role="tablist"
      className="relative flex gap-1 overflow-x-auto border-b border-hielo"
    >
      {opciones.map((o, i) => {
        const esActiva = i === activa;
        return (
          <button
            key={o.id}
            ref={(n) => (refs.current[i] = n)}
            role="tab"
            aria-selected={esActiva}
            onClick={() => onCambiar(i)}
            className={`relative whitespace-nowrap px-4 py-3 text-sm transition-colors duration-300 ${
              esActiva ? "font-medium text-white" : "text-acero hover:text-tinta"
            }`}
          >
            {o.texto}
            {typeof o.cuenta === "number" && (
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                  esActiva ? "bg-ambar text-abismo" : "bg-nube text-acero"
                }`}
              >
                {o.cuenta}
              </span>
            )}
          </button>
        );
      })}

      <span
        aria-hidden="true"
        className="absolute -bottom-px h-0.5 rounded-full bg-ambar shadow-naranja transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        style={{ left: barra.left, width: barra.width }}
      />
    </div>
  );
}
