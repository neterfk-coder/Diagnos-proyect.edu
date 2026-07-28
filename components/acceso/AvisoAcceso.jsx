"use client";

/**
 * Aviso de error del servidor, encima del botón de envío.
 * Se separa de los errores de campo porque estos vienen del backend y no
 * pertenecen a ningún input concreto: credenciales incorrectas, correo ya
 * registrado, enlace caducado…
 */
export default function AvisoAcceso({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div
      role="alert"
      className="mb-5 flex animate-temblar items-start gap-3 rounded-2xl border border-ambar/40 bg-ambar/10 px-4 py-3"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="mt-0.5 shrink-0 text-ambar"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
      </svg>
      <p className="text-sm leading-relaxed text-tinta">{mensaje}</p>
    </div>
  );
}
