"use client";

import { useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";

const LETRAS = ["A", "B", "C", "D", "E"];

/**
 * Cuestionario de opción múltiple con corrección inmediata.
 * Una vez respondida, la pregunta se bloquea: poder cambiar la respuesta
 * después de ver la corrección convertiría el ejercicio en un juego de
 * adivinar y no mediría nada.
 */
export default function Quiz({ preguntas }) {
  const { t } = useIdioma();
  const [respuestas, setRespuestas] = useState({});

  const contestadas = Object.keys(respuestas).length;
  const aciertos = Object.entries(respuestas).filter(
    ([i, elegida]) => preguntas[i].correcta === elegida
  ).length;
  const terminado = contestadas === preguntas.length;

  return (
    <div className="animate-aparecer">
      {/* Marcador */}
      <div className="tarjeta mb-5 flex items-center gap-4 p-5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hielo">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ambar to-ambarVivo transition-all duration-500"
            style={{ width: `${(contestadas / preguntas.length) * 100}%` }}
          />
        </div>
        <span
          translate="no"
          className="notranslate shrink-0 font-mono text-xs tabular-nums text-acero"
        >
          {aciertos}/{preguntas.length} {t.tutor.aciertos}
        </span>
      </div>

      <ol className="space-y-4">
        {preguntas.map((p, i) => {
          const elegida = respuestas[i];
          const contestada = elegida !== undefined;

          return (
            <li key={i} className="tarjeta p-6">
              <div className="flex gap-3">
                <span className="titulo shrink-0 text-2xl font-semibold leading-none text-ambar/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-tinta">
                  {p.pregunta}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {p.opciones.map((opcion, j) => {
                  const esCorrecta = j === p.correcta;
                  const esElegida = j === elegida;

                  let estilo =
                    "border-hielo bg-nube text-acero hover:border-cobalto/60 hover:text-tinta";
                  if (contestada) {
                    if (esCorrecta)
                      estilo = "border-electrico bg-electrico/15 text-tinta";
                    else if (esElegida)
                      estilo = "border-ambar bg-ambar/10 text-tinta";
                    else estilo = "border-hielo bg-nube text-acero/45";
                  }

                  return (
                    <button
                      key={j}
                      type="button"
                      disabled={contestada}
                      onClick={() => setRespuestas((r) => ({ ...r, [i]: j }))}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-300 disabled:cursor-default ${estilo}`}
                    >
                      <span
                        translate="no"
                        className={`notranslate mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[10px] ${
                          contestada && esCorrecta
                            ? "border-electrico bg-electrico text-abismo"
                            : contestada && esElegida
                            ? "border-ambar bg-ambar text-abismo"
                            : "border-current"
                        }`}
                      >
                        {LETRAS[j]}
                      </span>
                      <span className="leading-relaxed">{opcion}</span>
                    </button>
                  );
                })}
              </div>

              {contestada && p.porque && (
                <p
                  className={`mt-4 animate-aparecer rounded-2xl border-l-2 py-1 pl-3 text-sm leading-relaxed ${
                    elegida === p.correcta
                      ? "border-electrico text-acero"
                      : "border-ambar text-acero"
                  }`}
                >
                  {p.porque}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {terminado && (
        <div className="tarjeta mt-5 animate-aparecer p-6 text-center">
          <p className="titulo text-3xl font-semibold text-ambar">
            {aciertos}/{preguntas.length}
          </p>
          <p className="mt-2 text-sm text-acero">
            {aciertos === preguntas.length
              ? t.tutor.quizPerfecto
              : aciertos >= preguntas.length / 2
              ? t.tutor.quizBien
              : t.tutor.quizRepasa}
          </p>
          <button
            type="button"
            onClick={() => setRespuestas({})}
            className="boton-secundario mt-5 !px-5 !py-2 text-xs"
          >
            {t.tutor.quizReiniciar}
          </button>
        </div>
      )}
    </div>
  );
}
