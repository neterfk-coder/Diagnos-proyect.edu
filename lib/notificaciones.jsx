"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

/**
 * Avisos de la aplicación.
 *
 * Dos superficies con el mismo origen: el aviso flotante, que aparece y se
 * va solo, y la campana, que guarda el historial para quien no estaba
 * mirando en ese momento. Todo vive en memoria: son sucesos de la sesión,
 * no datos que deban sobrevivir a una recarga.
 */
const Contexto = createContext(null);

/** Cuánto dura el aviso flotante según su importancia. */
const DURACION = { logro: 6000, aviso: 5000, info: 4000 };

/** Tope de avisos simultáneos: más de tres tapan la pantalla. */
const MAX_VISIBLES = 3;

export function ProveedorNotificaciones({ children }) {
  const [visibles, setVisibles] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [leidas, setLeidas] = useState(0);
  const siguienteId = useRef(1);

  const descartar = useCallback((id) => {
    setVisibles((v) => v.filter((n) => n.id !== id));
  }, []);

  /**
   * @param tipo   info | aviso | logro
   * @param unica  clave opcional; si ya hay una viva con la misma, no repite.
   *               Evita que "cofre disponible" se apile cada vez que se gana.
   */
  const notificar = useCallback(
    ({ tipo = "info", titulo, texto, icono, unica }) => {
      const id = siguienteId.current++;
      const aviso = { id, tipo, titulo, texto, icono, unica, cuando: Date.now() };

      let duplicada = false;
      setVisibles((v) => {
        if (unica && v.some((n) => n.unica === unica)) {
          duplicada = true;
          return v;
        }
        return [...v, aviso].slice(-MAX_VISIBLES);
      });

      if (duplicada) return;

      setHistorial((h) => [aviso, ...h].slice(0, 30));
      setTimeout(() => descartar(id), DURACION[tipo] || DURACION.info);
    },
    [descartar]
  );

  const marcarLeidas = useCallback(() => setLeidas(historial.length), [historial]);
  const limpiar = useCallback(() => {
    setHistorial([]);
    setLeidas(0);
  }, []);

  return (
    <Contexto.Provider
      value={{
        visibles,
        historial,
        sinLeer: Math.max(0, historial.length - leidas),
        notificar,
        descartar,
        marcarLeidas,
        limpiar,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useNotificaciones() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error(
      "useNotificaciones debe usarse dentro de <ProveedorNotificaciones>."
    );
  }
  return contexto;
}
