"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/** Experiencia necesaria para llenar la barra y desbloquear un cofre. */
export const META = 100;

/**
 * Qué puntúa y cuánto.
 * Descubrir el error uno mismo vale más que recibir el diagnóstico, y
 * superar un ejercicio vale más que generarlo: se premia el esfuerzo del
 * estudiante, no el trabajo del modelo.
 */
export const RECOMPENSAS = {
  diagnostico: 10,
  descubrimiento: 25,
  ejercicioSuperado: 20,
  bucleCerrado: 50,
  materialEstudio: 15,
};

/**
 * Colección de pegatinas. La rareza decide el color del halo y la
 * probabilidad de que toque, que es de donde sale la emoción de abrir.
 */
export const PEGATINAS = [
  { id: "primer-paso", emoji: "🔍", rareza: "comun" },
  { id: "cazador-signos", emoji: "➖", rareza: "comun" },
  { id: "equilibrista", emoji: "⚖️", rareza: "comun" },
  { id: "parentesis", emoji: "🧩", rareza: "comun" },
  { id: "fraccionario", emoji: "🍰", rareza: "raro" },
  { id: "socratico", emoji: "💬", rareza: "raro" },
  { id: "insistente", emoji: "🔁", rareza: "raro" },
  { id: "lector", emoji: "📘", rareza: "raro" },
  { id: "mente-clara", emoji: "💡", rareza: "epico" },
  { id: "sin-red", emoji: "🎯", rareza: "epico" },
  { id: "demoledor", emoji: "🪓", rareza: "epico" },
  { id: "eureka", emoji: "🏆", rareza: "legendario" },
];

const PESOS = { comun: 50, raro: 30, epico: 15, legendario: 5 };

export const COLORES_RAREZA = {
  comun: { texto: "text-acero", borde: "border-hielo", halo: "rgba(147,167,204,.35)" },
  raro: { texto: "text-cobalto", borde: "border-cobalto/50", halo: "rgba(91,155,245,.45)" },
  epico: { texto: "text-ambar", borde: "border-ambar/60", halo: "rgba(255,159,0,.5)" },
  legendario: {
    texto: "text-ambar",
    borde: "border-ambar",
    halo: "rgba(255,183,51,.65)",
  },
};

const CLAVE = "diagnos:progreso";
const Contexto = createContext(null);

const INICIAL = { xp: 0, total: 0, cofres: 0, pegatinas: [] };

function leer() {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return INICIAL;
    const d = JSON.parse(crudo);
    return {
      xp: Number(d.xp) || 0,
      total: Number(d.total) || 0,
      cofres: Number(d.cofres) || 0,
      pegatinas: Array.isArray(d.pegatinas) ? d.pegatinas : [],
    };
  } catch {
    return INICIAL;
  }
}

/** Sorteo ponderado, evitando repetir lo que ya se tiene mientras quede algo. */
function sortear(yaTengo) {
  const disponibles = PEGATINAS.filter((p) => !yaTengo.includes(p.id));
  const bolsa = disponibles.length > 0 ? disponibles : PEGATINAS;

  const total = bolsa.reduce((s, p) => s + PESOS[p.rareza], 0);
  let corte = Math.random() * total;
  for (const p of bolsa) {
    corte -= PESOS[p.rareza];
    if (corte <= 0) return p;
  }
  return bolsa[bolsa.length - 1];
}

export function ProveedorProgreso({ children }) {
  const [datos, setDatos] = useState(INICIAL);
  const [montado, setMontado] = useState(false);
  const [ultimoPremio, setUltimoPremio] = useState(null);
  const [ganancia, setGanancia] = useState(null);

  // Se arranca en cero para que el HTML del servidor y el del cliente
  // coincidan; lo guardado se aplica ya hidratado.
  useEffect(() => {
    setDatos(leer());
    setMontado(true);
  }, []);

  useEffect(() => {
    if (!montado) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(datos));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [datos, montado]);

  /** Suma experiencia. El motivo sirve para el aviso flotante. */
  const sumar = useCallback((motivo) => {
    const cantidad = RECOMPENSAS[motivo];
    if (!cantidad) return;

    setDatos((d) => {
      const xp = d.xp + cantidad;
      const nuevosCofres = Math.floor(xp / META);
      return {
        xp: xp % META,
        total: d.total + cantidad,
        cofres: d.cofres + nuevosCofres,
        pegatinas: d.pegatinas,
      };
    });

    setGanancia({ motivo, cantidad, sello: Date.now() });
    setTimeout(() => setGanancia(null), 2600);
  }, []);

  /** Abre un cofre y devuelve la pegatina que toca. */
  const abrirCofre = useCallback(() => {
    let premio = null;
    setDatos((d) => {
      if (d.cofres <= 0) return d;
      premio = sortear(d.pegatinas);
      return {
        ...d,
        cofres: d.cofres - 1,
        pegatinas: d.pegatinas.includes(premio.id)
          ? d.pegatinas
          : [...d.pegatinas, premio.id],
      };
    });
    setUltimoPremio(premio);
    return premio;
  }, []);

  const reiniciar = useCallback(() => setDatos(INICIAL), []);

  return (
    <Contexto.Provider
      value={{
        ...datos,
        montado,
        porcentaje: Math.min(100, Math.round((datos.xp / META) * 100)),
        hayCofre: datos.cofres > 0,
        ganancia,
        ultimoPremio,
        sumar,
        abrirCofre,
        reiniciar,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useProgreso() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useProgreso debe usarse dentro de <ProveedorProgreso>.");
  }
  return contexto;
}
