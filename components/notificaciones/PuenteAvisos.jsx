"use client";

import { useEffect, useRef } from "react";
import { useProgreso, META } from "@/lib/progreso";
import { useNotificaciones } from "@/lib/notificaciones";
import { useIdioma } from "@/lib/i18n/contexto";

/**
 * Convierte lo que ocurre en el progreso en avisos.
 *
 * Se hace en un componente aparte para que el sistema de progreso no tenga
 * que conocer el de notificaciones: cada uno sigue siendo utilizable por su
 * cuenta y el acoplamiento vive en un solo sitio.
 */
export default function PuenteAvisos() {
  const { t } = useIdioma();
  const { ganancia, hayCofre, cofres, racha, rachaHoy, montado } = useProgreso();
  const { notificar } = useNotificaciones();

  const ultimaGanancia = useRef(null);
  const cofresAvisados = useRef(0);
  const rachaAvisada = useRef(false);

  // Puntos ganados
  useEffect(() => {
    if (!ganancia || ganancia.sello === ultimaGanancia.current) return;
    ultimaGanancia.current = ganancia.sello;
    notificar({
      tipo: "info",
      icono: "✨",
      titulo: `+${ganancia.cantidad} · ${t.progreso.motivos[ganancia.motivo]}`,
      texto: t.notificaciones.puntosTexto,
    });
  }, [ganancia, notificar, t]);

  // Cofre disponible
  useEffect(() => {
    if (!hayCofre || cofres <= cofresAvisados.current) return;
    cofresAvisados.current = cofres;
    notificar({
      tipo: "logro",
      icono: "🎁",
      titulo: t.progreso.cofreListo,
      texto: t.notificaciones.cofreTexto,
      unica: "cofre",
    });
  }, [hayCofre, cofres, notificar, t]);

  // Racha en juego: se avisa una sola vez por carga, y no el primer día
  useEffect(() => {
    if (!montado || rachaAvisada.current) return;
    if (racha <= 0 || rachaHoy) return;
    rachaAvisada.current = true;
    // Se retrasa para no competir con lo primero que ve el usuario al entrar
    const reloj = setTimeout(
      () =>
        notificar({
          tipo: "aviso",
          icono: "🔥",
          titulo: t.racha.enPeligroTitulo,
          texto: t.racha.enPeligroTexto,
          unica: "racha",
        }),
      2500
    );
    return () => clearTimeout(reloj);
  }, [montado, racha, rachaHoy, notificar, t]);

  return null;
}
