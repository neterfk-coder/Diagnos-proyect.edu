"use client";

import { useState } from "react";
import { useProgreso, HITOS } from "@/lib/progreso";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Racha() {
  const { t } = useIdioma();
  const { racha, rachaHoy, semana, mejorRacha, montado } = useProgreso();
  const [panel, setPanel] = useState(false);

  const visible = montado ? racha : 0;
  const encendida = visible > 0 && rachaHoy;
  const enPeligro = visible > 0 && !rachaHoy;
  const siguienteHito = HITOS.find((h) => h > visible) || null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setPanel((p) => !p)}
        aria-label={t.racha.aria}
        aria-expanded={panel}
        className={`flex items-center gap-1.5 rounded-full border py-1.5 pl-2 pr-2.5 transition-all duration-300 ${
          encendida
            ? "border-ambar/60 bg-ambar/15"
            : enPeligro
            ? "border-ambar/40 bg-nube"
            : "border-hielo bg-nube hover:border-cobalto/50"
        }`}
      >
        <span
          className={`text-sm leading-none ${
            encendida ? "animate-llama" : enPeligro ? "" : "opacity-40 grayscale"
          }`}
        >
          🔥
        </span>
        <span
          translate="no"
          className={`notranslate font-mono text-[11px] tabular-nums ${
            encendida ? "font-semibold text-ambar" : "text-acero"
          }`}
        >
          {visible}
        </span>
      </button>

      {panel && (
        <>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setPanel(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="tarjeta absolute right-0 z-20 mt-3 w-[17.5rem] animate-aparecer p-5 !shadow-tarjeta">
            {/* Cabecera */}
            <div className="flex items-center gap-3">
              <span
                className={`text-3xl leading-none ${
                  encendida ? "animate-llama" : "opacity-45 grayscale"
                }`}
              >
                🔥
              </span>
              <div>
                <p
                  translate="no"
                  className="notranslate titulo text-2xl font-semibold leading-none text-white"
                >
                  {visible}{" "}
                  <span className="text-base font-normal text-acero">
                    {visible === 1 ? t.racha.dia : t.racha.dias}
                  </span>
                </p>
                <p
                  className={`mt-1 text-[11px] ${
                    rachaHoy ? "text-cobalto" : "text-ambar"
                  }`}
                >
                  {visible === 0
                    ? t.racha.empezar
                    : rachaHoy
                    ? t.racha.hoyHecho
                    : t.racha.hoyPendiente}
                </p>
              </div>
            </div>

            {/* Semana */}
            <p className="etiqueta mt-5">{t.racha.semana}</p>
            <div className="mt-2.5 grid grid-cols-7 gap-1.5">
              {semana.map((d, i) => (
                <div
                  key={d.iso}
                  className="animate-entrar-dia text-center"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <p className="font-mono text-[10px] text-acero">
                    {t.racha.diasCortos[d.diaSemana]}
                  </p>
                  <span
                    className={`mt-1 grid aspect-square place-items-center rounded-xl border text-xs transition-all duration-300 ${
                      d.activo
                        ? "border-ambar bg-ambar/20 text-ambar"
                        : d.esHoy
                        ? "border-cobalto/50 border-dashed bg-nube text-acero"
                        : "border-hielo bg-nube text-acero/40"
                    }`}
                  >
                    {d.activo ? "🔥" : "·"}
                  </span>
                </div>
              ))}
            </div>

            {/* Aviso de racha en juego */}
            {enPeligro && (
              <div className="mt-4 rounded-2xl border border-ambar/40 bg-ambar/10 px-3.5 py-2.5">
                <p className="text-xs font-medium text-ambar">
                  {t.racha.enPeligroTitulo}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-acero">
                  {t.racha.enPeligroTexto}
                </p>
              </div>
            )}

            {visible === 0 && (
              <p className="mt-4 text-[11px] leading-relaxed text-acero">
                {t.racha.empezarTexto}
              </p>
            )}

            {/* Datos */}
            <dl className="mt-4 space-y-1.5 border-t border-hielo pt-4 text-xs">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-acero">{t.racha.mejor}</dt>
                <dd
                  translate="no"
                  className="notranslate font-mono tabular-nums text-tinta"
                >
                  {montado ? mejorRacha : 0}
                </dd>
              </div>
              {siguienteHito && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-acero">{t.racha.proximoHito}</dt>
                  <dd
                    translate="no"
                    className="notranslate font-mono tabular-nums text-ambar"
                  >
                    {siguienteHito} {t.racha.dias}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </>
      )}
    </div>
  );
}
