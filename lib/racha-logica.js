/**
 * Lógica de la racha diaria, sin React.
 *
 * Vive aparte de progreso.jsx para poder probarla: un fichero con JSX no se
 * puede importar desde node:test sin transformarlo primero, y estas reglas
 * —sobre todo los cruces de mes y de año— son justo lo que hay que verificar.
 */

/** Hitos de racha que merecen celebración aparte. */
export const HITOS = [3, 7, 14, 30, 60, 100, 365];

/** Fecha local en formato AAAA-MM-DD. Nada de UTC: la racha es del usuario. */
export function hoyISO(fecha = new Date()) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Días naturales entre dos fechas ISO. */
export function diasEntre(desdeISO, hastaISO) {
  const [a1, m1, d1] = desdeISO.split("-").map(Number);
  const [a2, m2, d2] = hastaISO.split("-").map(Number);
  return Math.round(
    (Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000
  );
}

/**
 * Racha que se puede mostrar hoy.
 *
 * Lo guardado puede estar caducado: si la última actividad fue anteayer, la
 * racha ya se rompió aunque el número siga escrito en el almacenamiento.
 * Ayer todavía cuenta, porque el día no ha terminado.
 */
export function rachaVigente(datos, dia = hoyISO()) {
  if (!datos?.ultimoDia) return 0;
  return diasEntre(datos.ultimoDia, dia) <= 1 ? datos.racha : 0;
}

/**
 * Estado de la racha tras registrar actividad en `dia`.
 * Función pura: devuelve el nuevo estado sin tocar el recibido.
 */
export function tocarDia(datos, dia) {
  if (datos.ultimoDia === dia) return { ...datos };

  const hueco = datos.ultimoDia ? diasEntre(datos.ultimoDia, dia) : Infinity;
  const racha = hueco === 1 ? datos.racha + 1 : 1;

  return {
    ...datos,
    racha,
    mejorRacha: Math.max(datos.mejorRacha || 0, racha),
    ultimoDia: dia,
    dias: [...(datos.dias || []), dia].slice(-40),
  };
}

/** Los siete días hasta `dia`, marcando en cuáles hubo actividad. */
export function semana(datos, dia = hoyISO()) {
  const [y, m, d] = dia.split("-").map(Number);
  const salida = [];
  for (let i = 6; i >= 0; i--) {
    const f = new Date(y, m - 1, d - i);
    const iso = hoyISO(f);
    salida.push({
      iso,
      diaSemana: f.getDay(),
      activo: (datos.dias || []).includes(iso),
      esHoy: i === 0,
    });
  }
  return salida;
}
