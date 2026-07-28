import { Client, Account, ID } from "appwrite";

/**
 * Cliente de cuentas de Appwrite (navegador).
 *
 * La sesión la gestiona Appwrite con una cookie propia; aquí no se guarda
 * ninguna credencial. Devuelve null si el proyecto no está configurado, para
 * que la app siga arrancando en modo invitado.
 */
export function clienteCuenta() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const proyecto = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!endpoint || !proyecto) return null;

  const cliente = new Client().setEndpoint(endpoint).setProject(proyecto);
  return new Account(cliente);
}

export const hayCuentas = () => clienteCuenta() !== null;

/**
 * Traduce el error de Appwrite a una clave del diccionario.
 * Se devuelve la clave y no el texto porque el mensaje depende del idioma
 * que el usuario tenga activo en ese momento.
 */
export function claveDeError(error) {
  const tipo = error?.type || "";
  const codigo = error?.code;

  if (tipo === "user_already_exists" || codigo === 409) return "correoEnUso";
  if (tipo === "user_invalid_credentials") return "credencialesMal";
  if (tipo === "user_blocked") return "cuentaBloqueada";
  if (tipo === "password_personal_data") return "clavePersonal";
  if (tipo === "general_argument_invalid") return "datosInvalidos";
  if (tipo === "user_session_already_exists") return "yaHaySesion";
  if (tipo === "general_unknown_origin") return "origenNoAutorizado";
  if (tipo === "user_invalid_token" || tipo === "user_recovery_password_invalid")
    return "enlaceCaducado";
  if (codigo === 429) return "demasiadosIntentos";
  return "generico";
}

/** Usuario actual, o null si no hay sesión abierta. */
export async function usuarioActual() {
  const cuenta = clienteCuenta();
  if (!cuenta) return null;
  try {
    return await cuenta.get();
  } catch {
    return null; // 401 sin sesión: es el caso normal, no un fallo
  }
}

export async function iniciarSesion(correo, clave) {
  const cuenta = clienteCuenta();
  await cuenta.createEmailPasswordSession(correo, clave);
  return cuenta.get();
}

/**
 * Crea la cuenta, abre sesión y guarda el rol en las preferencias.
 * Si lo último falla, la cuenta ya existe y la sesión está abierta, así que
 * no se propaga el error: el rol se puede corregir después desde el perfil.
 */
export async function crearCuenta({ nombre, correo, clave, rol }) {
  const cuenta = clienteCuenta();
  await cuenta.create(ID.unique(), correo, clave, nombre);
  await cuenta.createEmailPasswordSession(correo, clave);
  try {
    await cuenta.updatePrefs({ rol });
  } catch {
    /* el rol es secundario */
  }
  return cuenta.get();
}

export async function cerrarSesionRemota() {
  const cuenta = clienteCuenta();
  if (!cuenta) return;
  try {
    await cuenta.deleteSession("current");
  } catch {
    /* si ya no había sesión, da igual */
  }
}

/** Envía el correo de recuperación. `url` recibirá userId y secret. */
export async function pedirRecuperacion(correo, url) {
  const cuenta = clienteCuenta();
  return cuenta.createRecovery(correo, url);
}

/** Completa el cambio de contraseña con los datos que llegan por la URL. */
export async function completarRecuperacion(userId, secret, clave) {
  const cuenta = clienteCuenta();
  return cuenta.updateRecovery(userId, secret, clave);
}

export async function cambiarRol(rol) {
  const cuenta = clienteCuenta();
  return cuenta.updatePrefs({ rol });
}
