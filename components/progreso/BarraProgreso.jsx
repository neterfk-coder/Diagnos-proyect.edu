"use client";

import { useEffect, useState } from "react";
import {
  useProgreso,
  PEGATINAS,
  META,
  COLORES_RAREZA,
} from "@/lib/progreso";
import { useIdioma } from "@/lib/i18n/contexto";
import Cofre from "@/components/progreso/Cofre";

export default function BarraProgreso() {
  const { t } = useIdioma();
  const {
    xp,
    total,
    cofres,
    pegatinas,
    porcentaje,
    hayCofre,
    ganancia,
    montado,
  } = useProgreso();

  const [panel, setPanel] = useState(false);
  const [cofreAbierto, setCofreAbierto] = useState(false);

  // Al ganar puntos se abre el panel un instante: sin eso, el premio pasa
  // desapercibido si el usuario está mirando otra parte de la pantalla.
  useEffect(() => {
    if (!ganancia) return;
    setPanel(true);
    const reloj = setTimeout(() => setPanel(false), 2600);
    return () => clearTimeout(reloj);
  }, [ganancia]);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => (hayCofre ? setCofreAbierto(true) : setPanel((p) => !p))}
          aria-label={t.progreso.aria}
          aria-expanded={panel}
          className={`group relative flex items-center gap-2.5 rounded-full border py-1.5 pl-3 pr-2.5 transition-all duration-300 ${
            hayCofre
              ? "border-ambar/60 bg-ambar/15 shadow-naranja"
              : "border-hielo bg-nube hover:border-cobalto/50"
          }`}
        >
          {/* Barra */}
          <span className="relative block h-1.5 w-14 overflow-hidden rounded-full bg-hielo sm:w-20">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ambar to-ambarVivo transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${montado ? porcentaje : 0}%` }}
            />
            {/* Barrido de luz mientras hay progreso */}
            {porcentaje > 0 && porcentaje < 100 && (
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-4 animate-barrido bg-white/40 blur-[3px]"
              />
            )}
          </span>

          {hayCofre ? (
            <span className="animate-latido-cofre text-base leading-none">🎁</span>
          ) : (
            <span
              translate="no"
              className="notranslate font-mono text-[11px] tabular-nums text-acero"
            >
              {montado ? xp : 0}
            </span>
          )}

          {/* Aviso flotante al sumar puntos */}
          {ganancia && (
            <span
              key={ganancia.sello}
              className="pointer-events-none absolute -bottom-6 right-0 animate-subir-ganancia whitespace-nowrap rounded-full bg-ambar px-2.5 py-1 text-[11px] font-semibold text-abismo shadow-naranja"
            >
              +{ganancia.cantidad} · {t.progreso.motivos[ganancia.motivo]}
            </span>
          )}
        </button>

        {/* Panel de colección */}
        {panel && (
          <>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setPanel(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="tarjeta absolute right-0 z-20 mt-3 w-[19rem] animate-aparecer p-5 !shadow-tarjeta">
              <div className="flex items-baseline justify-between gap-3">
                <p className="etiqueta">{t.progreso.etiqueta}</p>
                <p
                  translate="no"
                  className="notranslate font-mono text-xs text-acero"
                >
                  {total} {t.progreso.puntos}
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-hielo">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ambar to-ambarVivo transition-all duration-700"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-acero">
                {hayCofre
                  ? `${cofres} ${t.progreso.cofrePendientes}`
                  : `${META - xp} ${t.progreso.paraCofre}`}
              </p>

              {hayCofre && (
                <button
                  type="button"
                  onClick={() => {
                    setPanel(false);
                    setCofreAbierto(true);
                  }}
                  className="boton-acento mt-4 w-full !py-2.5 text-xs"
                >
                  {t.progreso.cofreAbrir}
                </button>
              )}

              {/* Colección */}
              <div className="mt-5 flex items-baseline justify-between">
                <p className="etiqueta">{t.progreso.coleccion}</p>
                <p
                  translate="no"
                  className="notranslate font-mono text-xs text-acero"
                >
                  {pegatinas.length} {t.progreso.de} {PEGATINAS.length}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-6 gap-2">
                {PEGATINAS.map((p) => {
                  const tengo = pegatinas.includes(p.id);
                  const c = COLORES_RAREZA[p.rareza];
                  return (
                    <span
                      key={p.id}
                      title={
                        tengo ? t.progreso.pegatinas[p.id] : t.progreso.bloqueada
                      }
                      className={`grid aspect-square place-items-center rounded-xl border text-lg transition-all duration-300 ${
                        tengo
                          ? `${c.borde} bg-papel`
                          : "border-hielo/60 bg-nube opacity-30 grayscale"
                      }`}
                    >
                      {tengo ? p.emoji : "?"}
                    </span>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <Cofre abierto={cofreAbierto} onCerrar={() => setCofreAbierto(false)} />
    </>
  );
}
