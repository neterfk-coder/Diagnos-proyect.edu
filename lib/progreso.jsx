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

/** Hitos de racha que merecen celebración aparte. */
export const HITOS = [3, 7, 14, 30, 60, 100, 365];

const CLAVE = "diagnos:progreso";
const Contexto = createContext(null);

const INICIAL = {
  xp: 0,
  total: 0,
  cofres: 0,
  pegatinas: [],
  racha: 0,
  mejorRacha: 0,
  ultimoDia: null,
  dias: [],
};

/** Fecha local en formato AAAA-MM-DD. Nada de UTC: la racha es del usuario. */
export function hoyISO(fecha = new Date()) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Días completos entre dos fechas ISO, contando por días naturales. */
function diasEntre(desdeISO, hastaISO) {
  const [a1, m1, d1] = desdeISO.split("-").map(Number);
  const [a2, m2, d2] = hastaISO.split("-").map(Number);
  const a = Date.UTC(a1, m1 - 1, d1);
  const b = Date.UTC(a2, m2 - 1, d2);
  return Math.round((b - a) / 86400000);
}

/**
 * Racha que se puede mostrar hoy.
 *
 * Lo guardado puede estar caducado: si la última actividad fue anteayer, la
 * racha ya se rompió aunque el número siga escrito en el almacenamiento.
 * Ayer todavía cuenta, porque el día no ha terminado.
 */
export function rachaVigente(datos, dia = hoyISO()) {
  if (!datos.ultimoDia) return 0;
  const hueco = diasEntre(datos.ultimoDia, dia);
  return hueco <= 1 ? datos.racha : 0;
}

/** Los siete días hasta hoy, marcando en cuáles hubo actividad. */
export function semana(datos, dia = hoyISO()) {
  const [y, m, d] = dia.split("-").map(Number);
  const salida = [];
  for (let i = 6; i >= 0; i--) {
    const f = new Date(y, m - 1, d - i);
    const iso = hoyISO(f);
    salida.push({
      iso,
      diaSemana: f.getDay(),
      activo: datos.dias.includes(iso),
      esHoy: i === 0,
    });
  }
  return salida;
}

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
      racha: Number(d.racha) || 0,
      mejorRacha: Number(d.mejorRacha) || 0,
      ultimoDia: typeof d.ultimoDia === "string" ? d.ultimoDia : null,
      dias: Array.isArray(d.dias) ? d.dias.slice(-40) : [],
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
  const [celebracion, setCelebracion] = useState(null);
  const [dia, setDia] = useState(hoyISO());

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

  // La fecha se revisa cada minuto: si alguien deja la pestaña abierta y
  // cruza la medianoche, la racha debe reflejarlo sin recargar.
  useEffect(() => {
    const reloj = setInterval(() => {
      const ahora = hoyISO();
      setDia((anterior) => (anterior === ahora ? anterior : ahora));
    }, 60000);
    return () => clearInterval(reloj);
  }, []);

  /** Suma experiencia y da por vivido el día de hoy. */
  const sumar = useCallback((motivo) => {
    const cantidad = RECOMPENSAS[motivo];
    if (!cantidad) return;

    const ahora = hoyISO();
    let subioRacha = null;

    setDatos((d) => {
      const xp = d.xp + cantidad;
      const nuevosCofres = Math.floor(xp / META);

      // --- Racha ---
      let { racha, mejorRacha, ultimoDia, dias } = d;
      if (ultimoDia !== ahora) {
        const hueco = ultimoDia ? diasEntre(ultimoDia, ahora) : Infinity;
        racha = hueco === 1 ? racha + 1 : 1;
        ultimoDia = ahora;
        dias = [...dias, ahora].slice(-40);
        mejorRacha = Math.max(mejorRacha, racha);
        subioRacha = racha;
      }

      return {
        xp: xp % META,
        total: d.total + cantidad,
        cofres: d.cofres + nuevosCofres,
        pegatinas: d.pegatinas,
        racha,
        mejorRacha,
        ultimoDia,
        dias,
      };
    });

    setGanancia({ motivo, cantidad, sello: Date.now() });
    setTimeout(() => setGanancia(null), 2600);

    // La celebración va después del render para que el número ya esté puesto
    if (subioRacha !== null) {
      setTimeout(
        () =>
          setCelebracion({
            dias: subioRacha,
            hito: HITOS.includes(subioRacha),
            sello: Date.now(),
          }),
        700
      );
    }
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
        // La racha mostrada se recalcula contra el día actual, no se lee tal
        // cual: lo guardado puede haber caducado desde la última visita.
        racha: rachaVigente(datos, dia),
        rachaHoy: datos.ultimoDia === dia,
        semana: semana(datos, dia),
        celebracion,
        cerrarCelebracion: () => setCelebracion(null),
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
