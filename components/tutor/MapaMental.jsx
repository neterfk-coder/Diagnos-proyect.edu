"use client";

import { useMemo, useState } from "react";

const ANCHO = 940;
const ALTO = 660;
const CX = ANCHO / 2;
const CY = ALTO / 2;
const R_RAMA = 178;
const R_HIJO = 292;

/** Ancho aproximado de una etiqueta. Basta para que no se solapen. */
function anchoTexto(texto, tam) {
  return Math.max(58, texto.length * tam * 0.55 + 26);
}

/**
 * Mapa mental radial.
 *
 * Se dibuja a mano en SVG en lugar de usar una librería de grafos: con cinco
 * ramas y sus hijos, un layout radial fijo da un resultado más limpio y
 * predecible que un algoritmo de fuerzas, que en cada render coloca las
 * cosas en un sitio distinto.
 */
export default function MapaMental({ mapa }) {
  const [activa, setActiva] = useState(null);

  const nodos = useMemo(() => {
    const ramas = mapa.ramas.slice(0, 6);
    const n = ramas.length;

    return ramas.map((rama, i) => {
      // Se empieza arriba y se reparte el círculo completo
      const angulo = (-Math.PI / 2) + (i * 2 * Math.PI) / n;
      const x = CX + Math.cos(angulo) * R_RAMA;
      const y = CY + Math.sin(angulo) * R_RAMA;

      const hijos = rama.hijos.slice(0, 4);
      const abanico = Math.min(0.62, 0.26 * hijos.length);

      return {
        ...rama,
        i,
        x,
        y,
        angulo,
        hijos: hijos.map((texto, j) => {
          const desvio =
            hijos.length === 1
              ? 0
              : -abanico / 2 + (j * abanico) / (hijos.length - 1);
          const a = angulo + desvio;
          return {
            texto,
            x: CX + Math.cos(a) * R_HIJO,
            y: CY + Math.sin(a) * R_HIJO,
          };
        }),
      };
    });
  }, [mapa]);

  const anchoCentro = anchoTexto(mapa.centro, 17);

  return (
    <div className="overflow-hidden rounded-3xl border border-hielo bg-abismo/50">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="block w-full"
        role="img"
        aria-label={mapa.centro}
      >
        <defs>
          <radialGradient id="halo-centro">
            <stop offset="0%" stopColor="#FF9F00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF9F00" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r="150" fill="url(#halo-centro)" />

        {/* Trazos: primero los de los hijos, para que queden por debajo */}
        {nodos.map((r) =>
          r.hijos.map((h, j) => (
            <path
              key={`th${r.i}-${j}`}
              d={`M${r.x} ${r.y} Q ${(r.x + h.x) / 2 + 12} ${(r.y + h.y) / 2} ${h.x} ${h.y}`}
              fill="none"
              stroke={activa === r.i ? "#FF9F00" : "#22366A"}
              strokeWidth={activa === r.i ? 2 : 1.4}
              className="animate-dibujar-rama"
              style={{
                strokeDasharray: 420,
                animationDelay: `${420 + r.i * 130 + j * 70}ms`,
                transition: "stroke .35s, stroke-width .35s",
              }}
            />
          ))
        )}

        {nodos.map((r) => (
          <path
            key={`tr${r.i}`}
            d={`M${CX} ${CY} Q ${(CX + r.x) / 2 + 16} ${(CY + r.y) / 2} ${r.x} ${r.y}`}
            fill="none"
            stroke={activa === r.i ? "#FFB733" : "#3D7AE0"}
            strokeWidth={activa === r.i ? 3 : 2}
            className="animate-dibujar-rama"
            style={{
              strokeDasharray: 420,
              animationDelay: `${r.i * 130}ms`,
              transition: "stroke .35s, stroke-width .35s",
            }}
          />
        ))}

        {/* Hijos */}
        {nodos.map((r) =>
          r.hijos.map((h, j) => {
            const w = anchoTexto(h.texto, 12);
            return (
              <g
                key={`h${r.i}-${j}`}
                className="animate-brotar"
                style={{ animationDelay: `${620 + r.i * 130 + j * 70}ms` }}
              >
                <rect
                  x={h.x - w / 2}
                  y={h.y - 15}
                  width={w}
                  height="30"
                  rx="15"
                  fill="#0E1D42"
                  stroke={activa === r.i ? "#FF9F00" : "#22366A"}
                  strokeWidth="1.4"
                  style={{ transition: "stroke .35s" }}
                />
                <text
                  x={h.x}
                  y={h.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill={activa === r.i ? "#FFB733" : "#93A7CC"}
                  style={{ transition: "fill .35s" }}
                >
                  {h.texto}
                </text>
              </g>
            );
          })
        )}

        {/* Ramas */}
        {nodos.map((r) => {
          const w = anchoTexto(r.titulo, 14);
          return (
            <g
              key={`r${r.i}`}
              onMouseEnter={() => setActiva(r.i)}
              onMouseLeave={() => setActiva(null)}
              className="animate-brotar cursor-pointer"
              style={{ animationDelay: `${260 + r.i * 130}ms` }}
            >
              <rect
                x={r.x - w / 2}
                y={r.y - 19}
                width={w}
                height="38"
                rx="19"
                fill={activa === r.i ? "#FF9F00" : "#132449"}
                stroke={activa === r.i ? "#FFB733" : "#3D7AE0"}
                strokeWidth="1.8"
                style={{ transition: "fill .35s, stroke .35s" }}
              />
              <text
                x={r.x}
                y={r.y + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill={activa === r.i ? "#060D20" : "#E9F0FC"}
                style={{ transition: "fill .35s" }}
              >
                {r.titulo}
              </text>
            </g>
          );
        })}

        {/* Centro */}
        <g className="animate-brotar">
          <rect
            x={CX - anchoCentro / 2}
            y={CY - 26}
            width={anchoCentro}
            height="52"
            rx="26"
            fill="#FF9F00"
          />
          <text
            x={CX}
            y={CY + 7}
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#060D20"
          >
            {mapa.centro}
          </text>
        </g>
      </svg>
    </div>
  );
}
