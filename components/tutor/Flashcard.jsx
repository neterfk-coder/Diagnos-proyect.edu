"use client";

import { useEffect, useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";

/**
 * Tarjeta que gira sobre su eje vertical.
 * El giro es 3D real (rotateY + backface-visibility), no un cambio de
 * contenido: por eso hay dos caras superpuestas y una de ellas nace girada.
 */
export default function Flashcard({ tarjeta, indice, total }) {
  const { t } = useIdioma();
  const [girada, setGirada] = useState(false);

  // Al cambiar de tarjeta siempre se vuelve al anverso
  useEffect(() => setGirada(false), [indice]);

  return (
    <div className="perspectiva w-full">
      <button
        type="button"
        onClick={() => setGirada((g) => !g)}
        aria-label={t.tutor.girar}
        aria-pressed={girada}
        className={`cara-3d relative block h-72 w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalto sm:h-64 ${
          girada ? "cara-3d-girada" : ""
        }`}
      >
        {/* Anverso */}
        <span className="cara tarjeta absolute inset-0 flex flex-col justify-between p-7 sm:p-8">
          <span className="etiqueta">
            {t.tutor.anverso} · {indice + 1}/{total}
          </span>
          <span className="titulo text-xl font-semibold leading-snug text-white sm:text-2xl">
            {tarjeta.anverso}
          </span>
          <span className="flex items-center gap-2 text-xs text-acero">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
            </svg>
            {t.tutor.flashcardsAyuda}
          </span>
        </span>

        {/* Reverso */}
        <span className="cara cara-reverso tarjeta absolute inset-0 flex flex-col justify-between overflow-auto border-cobalto/40 bg-nube p-7 sm:p-8">
          <span className="etiqueta text-cobalto">{t.tutor.reverso}</span>
          <span className="text-[15px] leading-relaxed text-tinta">
            {tarjeta.reverso}
          </span>
          <span className="h-4" />
        </span>
      </button>
    </div>
  );
}
