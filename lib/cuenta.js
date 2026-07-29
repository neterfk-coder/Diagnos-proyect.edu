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

/**
 * Código de aula derivado del identificador del docente.
 * Es determinista para que un docente no pueda quedarse sin él, y corto
 * para que se pueda dictar en voz alta en clase.
 */
export function codigoDeAula(idUsuario) {
  return String(idUsuario || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase();
}

/** Aula a la que pertenece el usuario, o null si aún no tiene. */
export function aulaDeUsuario(usuario) {
  if (usuario?.prefs?.aula) return usuario.prefs.aula;
  if (usuario?.prefs?.rol === "docente") return codigoDeAula(usuario.$id);
  return null;
}

/** Un estudiante se une a un aula escribiendo su código. */
export async function guardarAula(aula, rol) {
  const cuenta = clienteCuenta();
  return cuenta.updatePrefs({ rol, aula: aula ? aula.trim().toUpperCase() : null });
}

/**
 * Guarda la personalización del perfil.
 *
 * El avatar viaja como data URI dentro de las preferencias en lugar de
 * subirse a Storage: una imagen de 128 px comprimida ocupa unos 6 KB, cabe
 * de sobra en el límite de las preferencias y evita tener que crear un
 * bucket, sus permisos y una ruta de subida.
 *
 * Las preferencias se reemplazan enteras en cada llamada, así que hay que
 * enviar también lo que no cambia o se perdería.
 */
export async function guardarPerfil({ nombre, prefsActuales, cambios }) {
  const cuenta = clienteCuenta();
  if (typeof nombre === "string" && nombre.trim()) {
    await cuenta.updateName(nombre.trim());
  }
  return cuenta.updatePrefs({ ...prefsActuales, ...cambios });
}

/** Preferencias tal y como están hoy en el servidor. */
export async function prefsActuales() {
  const usuario = await usuarioActual();
  return usuario?.prefs || {};
}

/**
 * Token de un solo uso que el servidor puede verificar para saber quién
 * está pidiendo algo. Dura 15 minutos; se pide justo antes de cada llamada.
 */
export async function crearJWT() {
  const cuenta = clienteCuenta();
  if (!cuenta) return null;
  try {
    const { jwt } = await cuenta.createJWT();
    return jwt;
  } catch {
    return null; // sin sesión no hay token, y es un caso normal
  }
}
