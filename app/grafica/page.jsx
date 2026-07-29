"use client";

import { useMemo, useState } from "react";
import CabeceraPagina from "@/components/CabeceraPagina";
import Lienzo from "@/components/grafica/Lienzo";
import { useIdioma } from "@/lib/i18n/contexto";
import { FUNCIONES, FAMILIAS, buscarFuncion, formula } from "@/lib/funciones";

const PARAMS_INICIALES = { a: 1, b: 1, c: 0, d: 0 };

/** Encuadre por familia: las trigonométricas se leen mejor en radianes. */
function vistaInicial(familia) {
  return familia === FAMILIAS.trigonometrica
    ? { xMin: -2 * Math.PI, xMax: 2 * Math.PI, yMin: -4, yMax: 4 }
    : { xMin: -8, xMax: 8, yMin: -6, yMax: 6 };
}

/** Control deslizante con su valor y su explicación. */
function Deslizador({ id, etiqueta, ayuda, valor, min, max, paso, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-tinta">
          {etiqueta}
        </label>
        <span
          translate="no"
          className="notranslate rounded-full bg-ambar/15 px-2.5 py-0.5 font-mono text-xs tabular-nums text-ambar"
        >
          {valor}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="deslizador mt-2.5"
      />
      <p className="mt-1.5 text-xs leading-relaxed text-acero">{ayuda}</p>
    </div>
  );
}

export default function Grafica() {
  const { t } = useIdioma();
  const g = t.grafica;

  const [idFuncion, setIdFuncion] = useState("tan");
  const [params, setParams] = useState(PARAMS_INICIALES);
  const [zoom, setZoom] = useState(1);

  const funcion = buscarFuncion(idFuncion);

  const vista = useMemo(() => {
    const base = vistaInicial(funcion.familia);
    return {
      xMin: base.xMin * zoom,
      xMax: base.xMax * zoom,
      yMin: base.yMin * zoom,
      yMax: base.yMax * zoom,
    };
  }, [funcion.familia, zoom]);

  function elegir(id) {
    setIdFuncion(id);
    setZoom(1);
  }

  function reiniciar() {
    setParams(PARAMS_INICIALES);
    setZoom(1);
  }

  const porFamilia = (familia) => FUNCIONES.filter((f) => f.familia === familia);
  const nota = g.notas[funcion.id];
  const hayAsintotas = ["tan", "sec", "csc", "cot", "inversa"].includes(funcion.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <CabeceraPagina etiqueta={g.etiqueta} titulo={g.titulo} entrada={g.entrada} />

      {/* Selector de función */}
      <div className="mt-12 space-y-5">
        {[FAMILIAS.trigonometrica, FAMILIAS.algebraica].map((familia) => (
          <div key={familia}>
            <p className="etiqueta mb-2.5">{g.familias[familia]}</p>
            <div className="flex flex-wrap gap-2">
              {porFamilia(familia).map((f) => {
                const activa = f.id === idFuncion;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => elegir(f.id)}
                    aria-pressed={activa}
                    translate="no"
                    className={`notranslate rounded-full border px-4 py-2 font-mono text-sm transition-all duration-300 ${
                      activa
                        ? "border-ambar bg-ambar text-abismo shadow-naranja"
                        : "border-hielo bg-nube text-acero hover:-translate-y-0.5 hover:border-cobalto/60 hover:text-tinta"
                    }`}
                  >
                    {f.etiqueta}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Gráfica */}
        <div>
          <div className="tarjeta p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <p
                translate="no"
                className="notranslate titulo text-xl font-semibold text-ambar sm:text-2xl"
              >
                {formula(funcion, params, funcion.etiqueta)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.25, z / 1.4))}
                  aria-label={g.acercar}
                  className="grid h-8 w-8 place-items-center rounded-full border border-hielo text-acero transition-colors hover:border-cobalto hover:text-cobalto"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(6, z * 1.4))}
                  aria-label={g.alejar}
                  className="grid h-8 w-8 place-items-center rounded-full border border-hielo text-acero transition-colors hover:border-cobalto hover:text-cobalto"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={reiniciar}
                  className="boton-secundario !px-4 !py-1.5 text-xs"
                >
                  {g.reiniciar}
                </button>
              </div>
            </div>

            <Lienzo funcion={funcion} params={params} vista={vista} />

            <p className="mt-3 px-1 text-xs text-acero">{g.pistaCursor}</p>
          </div>

          {(nota || hayAsintotas) && (
            <div className="tarjeta mt-4 border-ambar/30 p-5">
              {nota && (
                <p className="text-sm leading-relaxed text-tinta">{nota}</p>
              )}
              {hayAsintotas && (
                <p className="mt-2 text-xs leading-relaxed text-acero">
                  {g.asintotas}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Parámetros */}
        <div className="tarjeta h-fit p-6">
          <h2 className="titulo text-xl font-semibold text-white">{g.parametros}</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-acero">
            {g.ayudaParametros}
          </p>

          <div className="mt-6 space-y-6">
            <Deslizador
              id="param-a"
              etiqueta={`a · ${g.a}`}
              ayuda={g.aTexto}
              valor={params.a}
              min={-4}
              max={4}
              paso={0.1}
              onChange={(v) => setParams((p) => ({ ...p, a: v }))}
            />
            <Deslizador
              id="param-b"
              etiqueta={`b · ${g.b}`}
              ayuda={g.bTexto}
              valor={params.b}
              min={-4}
              max={4}
              paso={0.1}
              onChange={(v) => setParams((p) => ({ ...p, b: v }))}
            />
            <Deslizador
              id="param-c"
              etiqueta={`c · ${g.c}`}
              ayuda={g.cTexto}
              valor={params.c}
              min={-6}
              max={6}
              paso={0.1}
              onChange={(v) => setParams((p) => ({ ...p, c: v }))}
            />
            <Deslizador
              id="param-d"
              etiqueta={`d · ${g.d}`}
              ayuda={g.dTexto}
              valor={params.d}
              min={-6}
              max={6}
              paso={0.1}
              onChange={(v) => setParams((p) => ({ ...p, d: v }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
