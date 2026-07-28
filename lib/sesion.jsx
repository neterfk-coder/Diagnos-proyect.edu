"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  usuarioActual,
  iniciarSesion,
  crearCuenta,
  cerrarSesionRemota,
  guardarAula,
  aulaDeUsuario,
  hayCuentas,
} from "@/lib/cuenta";

/**
 * El modo invitado no crea usuario en Appwrite: es solo una marca local que
 * permite usar la herramienta sin cuenta. Así no se llena el proyecto de
 * usuarios anónimos por cada visita.
 */
const CLAVE_INVITADO = "diagnos:invitado";

const SESION_INVITADO = {
  nombre: "Guest",
  correo: null,
  rol: "estudiante",
  invitado: true,
};

const Contexto = createContext(null);

/** Convierte el usuario de Appwrite a la forma que usa la interfaz. */
function desdeUsuario(u) {
  return {
    id: u.$id,
    nombre: u.name || (u.email ? u.email.split("@")[0] : "—"),
    correo: u.email || null,
    rol: u.prefs?.rol === "docente" ? "docente" : "estudiante",
    aula: aulaDeUsuario(u),
    invitado: false,
  };
}

function leerMarcaInvitado() {
  try {
    return window.localStorage.getItem(CLAVE_INVITADO) === "1";
  } catch {
    return false;
  }
}

function escribirMarcaInvitado(activo) {
  try {
    if (activo) window.localStorage.setItem(CLAVE_INVITADO, "1");
    else window.localStorage.removeItem(CLAVE_INVITADO);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function ProveedorSesion({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    const usuario = await usuarioActual();
    if (usuario) {
      escribirMarcaInvitado(false);
      setSesion(desdeUsuario(usuario));
    } else {
      setSesion(leerMarcaInvitado() ? SESION_INVITADO : null);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  const entrar = useCallback(async (correo, clave) => {
    const usuario = await iniciarSesion(correo, clave);
    escribirMarcaInvitado(false);
    setSesion(desdeUsuario(usuario));
    return usuario;
  }, []);

  const registrar = useCallback(async (datos) => {
    const usuario = await crearCuenta(datos);
    escribirMarcaInvitado(false);
    setSesion(desdeUsuario(usuario));
    return usuario;
  }, []);

  const entrarComoInvitado = useCallback(() => {
    escribirMarcaInvitado(true);
    setSesion(SESION_INVITADO);
  }, []);

  /** Cambia rol y/o aula y refresca la sesión con lo que confirme el servidor. */
  const actualizarPerfil = useCallback(async ({ rol, aula }) => {
    await guardarAula(aula, rol);
    const usuario = await usuarioActual();
    if (usuario) setSesion(desdeUsuario(usuario));
    return usuario;
  }, []);

  const salir = useCallback(async () => {
    escribirMarcaInvitado(false);
    await cerrarSesionRemota();
    setSesion(null);
  }, []);

  return (
    <Contexto.Provider
      value={{
        sesion,
        cargando,
        hayCuentas: hayCuentas(),
        entrar,
        registrar,
        entrarComoInvitado,
        actualizarPerfil,
        salir,
        refrescar,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de <ProveedorSesion>.");
  }
  return contexto;
}
