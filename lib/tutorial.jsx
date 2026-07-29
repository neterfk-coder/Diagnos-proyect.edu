"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CLAVE = "diagnos:tutorial";
const Contexto = createContext(null);

export function ProveedorTutorial({ children }) {
  const [abierto, setAbierto] = useState(false);
  const [comprobado, setComprobado] = useState(false);

  // Se decide ya en el cliente: leer localStorage durante el render haría que
  // el HTML del servidor y el del navegador no coincidieran.
  useEffect(() => {
    let visto = true;
    try {
      visto = window.localStorage.getItem(CLAVE) === "1";
    } catch {
      /* sin almacenamiento se asume visto: mejor no molestar */
    }
    if (!visto) setAbierto(true);
    setComprobado(true);
  }, []);

  const marcarVisto = useCallback(() => {
    try {
      window.localStorage.setItem(CLAVE, "1");
    } catch {
      /* ignorado */
    }
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    marcarVisto();
  }, [marcarVisto]);

  /** Reabrirlo desde el centro de ayuda. */
  const abrir = useCallback(() => setAbierto(true), []);

  return (
    <Contexto.Provider value={{ abierto, comprobado, abrir, cerrar }}>
      {children}
    </Contexto.Provider>
  );
}

export function useTutorial() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useTutorial debe usarse dentro de <ProveedorTutorial>.");
  }
  return contexto;
}
