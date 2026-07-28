/**
 * Sesión de marcador de posición — SIN base de datos.
 *
 * Guarda el estado de acceso en localStorage solo para que la interfaz
 * pueda reaccionar (mostrar el nombre, el modo invitado, cerrar sesión).
 * NO es autenticación: no valida nada y cualquiera puede editarlo.
 * Cuando conectemos Appwrite, este archivo se sustituye por
 * account.createEmailPasswordSession() / account.get() / account.deleteSession().
 */

const CLAVE = "diagnos:sesion";

export function leerSesion() {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(sesion));
    window.dispatchEvent(new Event("diagnos:sesion"));
  } catch {
    /* almacenamiento no disponible: la app sigue funcionando */
  }
}

export function cerrarSesion() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLAVE);
    window.dispatchEvent(new Event("diagnos:sesion"));
  } catch {
    /* ignorado */
  }
}

export function entrarComoInvitado() {
  // El nombre no se muestra en modo invitado (la interfaz usa su propia
  // etiqueta traducida), así que se guarda un valor neutro.
  guardarSesion({ nombre: "Guest", rol: "estudiante", invitado: true });
}
