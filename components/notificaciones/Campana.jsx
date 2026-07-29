"use client";

import { useState } from "react";
import { useNotificaciones } from "@/lib/notificaciones";
import { useIdioma } from "@/lib/i18n/contexto";

/** "hace 3 min" a partir de una marca de tiempo. */
function haceCuanto(cuando, t) {
  const seg = Math.round((Date.now() - cuando) / 1000);
  if (seg < 60) return t.notificaciones.ahora;
  const min = Math.round(seg / 60);
  if (min < 60) return `${t.notificaciones.hace} ${min} min`;
  return `${t.notificaciones.hace} ${Math.round(min / 60)} h`;
}

export default function Campana() {
  const { t } = useIdioma();
  const { historial, sinLeer, marcarLeidas, limpiar } = useNotificaciones();
  const [abierto, setAbierto] = useState(false);

  function alternar() {
    const siguiente = !abierto;
    setAbierto(siguiente);
    if (siguiente) marcarLeidas();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={alternar}
        aria-label={t.notificaciones.aria}
        aria-expanded={abierto}
        className={`relative grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 ${
          sinLeer > 0
            ? "border-ambar/60 bg-ambar/15 text-ambar"
            : "border-hielo bg-nube text-acero hover:border-cobalto/60 hover:text-tinta"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={sinLeer > 0 ? "animate-campanear origin-top" : ""}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>

        {sinLeer > 0 && (
          <span
            translate="no"
            className="notranslate absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ambar px-1 font-mono text-[9px] font-bold text-abismo"
          >
            {sinLeer > 9 ? "9+" : sinLeer}
          </span>
        )}
      </button>

      {abierto && (
        <>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setAbierto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="tarjeta absolute right-0 z-20 mt-3 w-[19rem] animate-aparecer overflow-hidden !shadow-tarjeta">
            <div className="flex items-center justify-between gap-3 border-b border-hielo bg-nube px-4 py-3">
              <p className="etiqueta">{t.notificaciones.titulo}</p>
              {historial.length > 0 && (
                <button
                  type="button"
                  onClick={limpiar}
                  className="text-[11px] text-acero underline underline-offset-4 transition-colors hover:text-ambar"
                >
                  {t.notificaciones.limpiar}
                </button>
              )}
            </div>

            {historial.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm leading-relaxed text-acero">
                {t.notificaciones.vacio}
              </p>
            ) : (
              <ul className="max-h-80 divide-y divide-hielo overflow-y-auto">
                {historial.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-px shrink-0 text-base leading-none">
                      {n.icono}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug text-tinta">{n.titulo}</p>
                      {n.texto && (
                        <p className="mt-0.5 text-xs leading-relaxed text-acero">
                          {n.texto}
                        </p>
                      )}
                      <p className="mt-1 font-mono text-[10px] text-acero/70">
                        {haceCuanto(n.cuando, t)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
