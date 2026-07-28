"use client";

/**
 * Botón de envío con tres estados: reposo → cargando → listo.
 * El check final se dibuja trazo a trazo, no aparece de golpe.
 */
export default function BotonEnvio({
  estado = "reposo",
  children,
  textoCargando = "One moment…",
  textoListo = "Done",
  acento = false,
  ...props
}) {
  const cargando = estado === "cargando";
  const listo = estado === "listo";

  return (
    <button
      type="submit"
      disabled={cargando || listo}
      aria-live="polite"
      className={`${
        acento ? "boton-acento" : "boton-primario"
      } relative w-full overflow-hidden !py-3.5 disabled:!opacity-100 ${
        listo ? (acento ? "!bg-ambarVivo" : "!bg-celeste") : ""
      }`}
      {...props}
    >
      {/* Barrido de luz mientras procesa */}
      {cargando && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-1/3 animate-brillo bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}

      {listo ? (
        <>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="m4 12.5 5.2 5.2L20 7"
              className="animate-dibujar-trazo"
              style={{ strokeDasharray: 32 }}
            />
          </svg>
          {textoListo}
        </>
      ) : cargando ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-girar"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2.5"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          {textoCargando}
        </>
      ) : (
        children
      )}
    </button>
  );
}
