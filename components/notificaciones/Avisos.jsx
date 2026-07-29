"use client";

import { useNotificaciones } from "@/lib/notificaciones";

const ESTILOS = {
  logro: "border-ambar/50 bg-ambar/[0.12]",
  aviso: "border-ambar/40 bg-nube",
  info: "border-cobalto/40 bg-nube",
};

/** Pila de avisos flotantes, abajo a la derecha. */
export default function Avisos() {
  const { visibles, descartar } = useNotificaciones();

  if (visibles.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(21rem,calc(100vw-2.5rem))] flex-col gap-2.5"
    >
      {visibles.map((n) => (
        <div
          key={n.id}
          role="status"
          className={`tarjeta pointer-events-auto flex animate-entrar-aviso items-start gap-3 border p-4 !shadow-tarjeta ${
            ESTILOS[n.tipo] || ESTILOS.info
          }`}
        >
          <span className="mt-px shrink-0 text-xl leading-none">{n.icono}</span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-tinta">
              {n.titulo}
            </p>
            {n.texto && (
              <p className="mt-0.5 text-xs leading-relaxed text-acero">{n.texto}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => descartar(n.id)}
            aria-label="Cerrar"
            className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-acero transition-colors hover:text-tinta"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
