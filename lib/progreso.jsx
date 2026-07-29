"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  HITOS,
  hoyISO,
  rachaVigente,
  semana,
  tocarDia,
} from "@/lib/racha-logica";

// Se reexportan para que los componentes sigan importando desde aquí
export { HITOS, hoyISO, rachaVigente, semana };

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
  // Último día ya celebrado. Se siembra con lo que había guardado para que
  // abrir la página con la racha de hoy hecha no dispare la celebración.
  const diaCelebrado = useRef(null);

  // Se arranca en cero para que el HTML del servidor y el del cliente
  // coincidan; lo guardado se aplica ya hidratado.
  useEffect(() => {
    const guardado = leer();
    diaCelebrado.current = guardado.ultimoDia;
    setDatos(guardado);
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

    // El actualizador se mantiene puro: React puede ejecutarlo más de una
    // vez, así que decidir aquí dentro si celebrar disparaba la celebración
    // por duplicado. Lo que hay que celebrar se deduce después comparando.
    setDatos((d) => {
      const xp = d.xp + cantidad;
      const nuevosCofres = Math.floor(xp / META);
      // La racha la resuelve tocarDia, que está cubierta por tests
      const conRacha = tocarDia(d, ahora);

      return {
        ...conRacha,
        xp: xp % META,
        total: d.total + cantidad,
        cofres: d.cofres + nuevosCofres,
      };
    });

    setGanancia({ motivo, cantidad, sello: Date.now() });
  }, []);

  // El aviso flotante se retira solo. Un temporizador por aviso hacía que
  // el de una ganancia anterior borrase el de la siguiente antes de tiempo.
  useEffect(() => {
    if (!ganancia) return;
    const reloj = setTimeout(() => setGanancia(null), 2600);
    return () => clearTimeout(reloj);
  }, [ganancia]);

  // La celebración se dispara al detectar que el día cambió de verdad en el
  // estado ya aplicado, no dentro del actualizador.
  useEffect(() => {
    if (!montado || !datos.ultimoDia) return;
    if (datos.ultimoDia !== hoyISO()) return;
    setCelebracion((previa) => {
      if (previa || diaCelebrado.current === datos.ultimoDia) return previa;
      diaCelebrado.current = datos.ultimoDia;
      return {
        dias: datos.racha,
        hito: HITOS.includes(datos.racha),
        sello: Date.now(),
      };
    });
  }, [montado, datos.ultimoDia, datos.racha]);

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
