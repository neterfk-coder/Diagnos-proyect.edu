"use client";

import { useMemo, useRef, useState } from "react";
import {
  muestrear,
  asintotas,
  marcasX,
  marcasY,
  evaluar,
} from "@/lib/funciones";

const ANCHO = 880;
const ALTO = 520;

export default function Lienzo({ funcion, params, vista }) {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState(null);

  const px = (x) => ((x - vista.xMin) / (vista.xMax - vista.xMin)) * ANCHO;
  const py = (y) => ALTO - ((y - vista.yMin) / (vista.yMax - vista.yMin)) * ALTO;

  // Recalcular la curva en cada render sería caro: solo cambia si cambian
  // la función, los parámetros o el encuadre.
  const tramos = useMemo(
    () => muestrear(funcion, params, vista),
    [funcion, params, vista]
  );
  const asint = useMemo(
    () => asintotas(funcion, params, vista),
    [funcion, params, vista]
  );
  const mx = useMemo(() => marcasX(funcion, vista), [funcion, vista]);
  const my = useMemo(() => marcasY(vista), [vista]);

  function alMover(evento) {
    const caja = svgRef.current?.getBoundingClientRect();
    if (!caja) return;
    const relativo = (evento.clientX - caja.left) / caja.width;
    const x = vista.xMin + relativo * (vista.xMax - vista.xMin);
    const y = evaluar(funcion, x, params);
    setCursor({ x, y: Number.isFinite(y) ? y : null });
  }

  const dentroY = cursor?.y !== null && cursor?.y > vista.yMin && cursor?.y < vista.yMax;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-hielo bg-abismo/60">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="block w-full touch-none"
        onMouseMove={alMover}
        onMouseLeave={() => setCursor(null)}
        role="img"
        aria-label={`Gráfica de ${funcion.etiqueta}`}
      >
        <defs>
          <linearGradient id="trazo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF9F00" />
            <stop offset="50%" stopColor="#FFB733" />
            <stop offset="100%" stopColor="#FF9F00" />
          </linearGradient>
          <filter id="resplandor" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="borroso" />
            <feMerge>
              <feMergeNode in="borroso" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Retícula */}
        <g stroke="#22366A" strokeWidth="1" opacity="0.55">
          {mx.map((m) => (
            <line key={`gx${m.x}`} x1={px(m.x)} y1="0" x2={px(m.x)} y2={ALTO} />
          ))}
          {my.map((m) => (
            <line key={`gy${m.y}`} x1="0" y1={py(m.y)} x2={ANCHO} y2={py(m.y)} />
          ))}
        </g>

        {/* Asíntotas */}
        <g stroke="#FF9F00" strokeWidth="1.5" strokeDasharray="5 7" opacity="0.4">
          {asint.map((x, i) => (
            <line key={`as${i}`} x1={px(x)} y1="0" x2={px(x)} y2={ALTO} />
          ))}
        </g>

        {/* Ejes */}
        <g stroke="#93A7CC" strokeWidth="1.6">
          <line x1="0" y1={py(0)} x2={ANCHO} y2={py(0)} />
          <line x1={px(0)} y1="0" x2={px(0)} y2={ALTO} />
        </g>

        {/* Marcas y etiquetas */}
        <g fill="#93A7CC" fontSize="13" fontFamily="var(--font-mono), monospace">
          {mx.map((m) => (
            <g key={`tx${m.x}`}>
              <line
                x1={px(m.x)}
                y1={py(0) - 5}
                x2={px(m.x)}
                y2={py(0) + 5}
                stroke="#93A7CC"
                strokeWidth="1.6"
              />
              <text x={px(m.x)} y={py(0) + 22} textAnchor="middle">
                {m.texto}
              </text>
            </g>
          ))}
          {my.map((m) => (
            <g key={`ty${m.y}`}>
              <line
                x1={px(0) - 5}
                y1={py(m.y)}
                x2={px(0) + 5}
                y2={py(m.y)}
                stroke="#93A7CC"
                strokeWidth="1.6"
              />
              <text x={px(0) - 10} y={py(m.y) + 4} textAnchor="end">
                {m.texto}
              </text>
            </g>
          ))}
        </g>

        {/* La curva */}
        <g
          fill="none"
          stroke="url(#trazo)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#resplandor)"
        >
          {tramos.map((tramo, i) => (
            <path
              key={i}
              d={tramo
                .map(([x, y], j) => `${j === 0 ? "M" : "L"}${px(x)} ${py(y)}`)
                .join(" ")}
            />
          ))}
        </g>

        {/* Cursor de lectura */}
        {cursor && (
          <g>
            <line
              x1={px(cursor.x)}
              y1="0"
              x2={px(cursor.x)}
              y2={ALTO}
              stroke="#9CC4FA"
              strokeWidth="1"
              strokeDasharray="4 5"
              opacity="0.6"
            />
            {dentroY && (
              <circle
                cx={px(cursor.x)}
                cy={py(cursor.y)}
                r="6"
                fill="#FF9F00"
                stroke="#060D20"
                strokeWidth="2.5"
              />
            )}
          </g>
        )}
      </svg>

      {/* Lectura numérica */}
      {cursor && (
        <div
          translate="no"
          className="notranslate pointer-events-none absolute right-4 top-4 rounded-2xl border border-hielo bg-papel/90 px-3.5 py-2 font-mono text-xs text-tinta backdrop-blur"
        >
          x = {cursor.x.toFixed(2)}
          <span className="mx-2 text-hielo">·</span>
          y = {cursor.y === null ? "—" : cursor.y.toFixed(2)}
        </div>
      )}
    </div>
  );
}
