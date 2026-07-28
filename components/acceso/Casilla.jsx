"use client";

/** Casilla de verificación con el check dibujado trazo a trazo. */
export default function Casilla({ id, marcada, onChange, children }) {
  return (
    <label
      htmlFor={id}
      className="group flex cursor-pointer items-start gap-2.5 text-sm text-acero"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={marcada}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`casilla mt-[1px] group-hover:border-cobalto/60 ${
          marcada ? "casilla-marcada" : ""
        }`}
      >
        {marcada && (
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#060D20"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="m4 12.5 5.2 5.2L20 7"
              className="animate-dibujar-trazo"
              style={{ strokeDasharray: 32 }}
            />
          </svg>
        )}
      </span>
      <span className="leading-snug">{children}</span>
    </label>
  );
}
