"use client";

import { createContext, useContext, useEffect, useState } from "react";
import en from "./en";
import es from "./es";

const DICCIONARIOS = { en, es };

export const IDIOMAS = [
  { codigo: "en", nombre: "English", corto: "EN" },
  { codigo: "es", nombre: "Español", corto: "ES" },
];

export const IDIOMA_POR_DEFECTO = "en";

const CLAVE = "diagnos:idioma";
const Contexto = createContext(null);

export function ProveedorIdioma({ children }) {
  // Se arranca siempre en el idioma por defecto para que el HTML del
  // servidor y el del cliente coincidan; la preferencia guardada se aplica
  // en el efecto, ya hidratado.
  const [idioma, setIdioma] = useState(IDIOMA_POR_DEFECTO);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado && DICCIONARIOS[guardado]) setIdioma(guardado);
    } catch {
      /* almacenamiento no disponible: se queda en el idioma por defecto */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  function cambiarIdioma(nuevo) {
    if (!DICCIONARIOS[nuevo]) return;
    setIdioma(nuevo);
    try {
      window.localStorage.setItem(CLAVE, nuevo);
    } catch {
      /* ignorado */
    }
  }

  return (
    <Contexto.Provider
      value={{ idioma, cambiarIdioma, t: DICCIONARIOS[idioma] }}
    >
      {children}
    </Contexto.Provider>
  );
}

/** Devuelve { idioma, cambiarIdioma, t } donde t es el diccionario activo. */
export function useIdioma() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useIdioma debe usarse dentro de <ProveedorIdioma>.");
  }
  return contexto;
}
