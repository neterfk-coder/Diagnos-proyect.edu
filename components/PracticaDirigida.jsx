"use client";

import { useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";
import { useProgreso } from "@/lib/progreso";
import { textoMisconception } from "@/lib/misconceptions";

/** Un ejercicio con su caja de respuesta y su veredicto. */
function Ejercicio({ ejercicio, indice, diagnostico, onResultado }) {
  const { t, idioma } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const [pista, setPista] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [comprobando, setComprobando] = useState(false);
  const [veredicto, setVeredicto] = useState(null);
  const [error, setError] = useState(null);

  const superado = veredicto && !veredicto.reincide;

  async function comprobar() {
    if (!respuesta.trim() || comprobando) return;
    setComprobando(true);
    setError(null);
    try {
      const res = await fetch("/api/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enunciado: ejercicio.enunciado,
          respuesta,
          misconception: diagnostico.misconception,
          detalle: diagnostico.detalle_misconception,
          idioma,
        }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error);
      setVeredicto(datos);
      onResultado(indice, !datos.reincide);
    } catch {
      setError(t.practica.errorComprobar);
    } finally {
      setComprobando(false);
    }
  }

  function reintentar() {
    setVeredicto(null);
    setRespuesta("");
    onResultado(indice, false);
  }

  return (
    <li
      className={`tarjeta animate-aparecer p-5 transition-colors duration-500 ${
        superado ? "border-electrico/50" : ""
      }`}
      style={{ animationDelay: `${indice * 140}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="etiqueta">
          {t.practica.niveles[ejercicio.nivel] || ejercicio.nivel}
        </span>

        {superado ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-electrico/15 px-2.5 py-1 text-[11px] font-medium text-cobalto">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m4 12.5 5.2 5.2L20 7" />
            </svg>
            {t.practica.superado}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setPista((p) => !p)}
            className="text-xs text-cobalto underline underline-offset-4 transition-colors hover:text-celeste"
          >
            {pista ? t.practica.ocultarPista : t.practica.verPista}
          </button>
        )}
      </div>

      <p translate="no" className="notranslate mt-2 font-mono text-[15px] text-tinta">
        {ejercicio.enunciado}
      </p>

      {pista && !superado && (
        <p className="mt-3 animate-aparecer border-l-2 border-ambar/50 pl-3 text-sm text-acero">
          {ejercicio.pista}
        </p>
      )}

      {/* ---------- Veredicto ---------- */}
      {veredicto ? (
        <div
          className={`mt-4 animate-aparecer rounded-2xl border p-4 ${
            superado
              ? "border-electrico/40 bg-electrico/10"
              : "border-ambar/40 bg-ambar/10"
          }`}
        >
          <p className="text-sm leading-relaxed text-tinta">
            {veredicto.comentario}
          </p>
          {veredicto.reincide && veredicto.siguiente_pregunta && (
            <p className="mt-2 text-sm font-medium leading-relaxed text-ambar">
              {veredicto.siguiente_pregunta}
            </p>
          )}
          {veredicto.reincide && (
            <button
              type="button"
              onClick={reintentar}
              className="boton-secundario mt-4 !px-5 !py-2 text-xs"
            >
              {t.practica.reintentar}
            </button>
          )}
        </div>
      ) : (
        <>
          {!abierto ? (
            <button
              type="button"
              onClick={() => setAbierto(true)}
              className="boton-secundario mt-4 !px-5 !py-2 text-xs"
            >
              {t.practica.resolver}
            </button>
          ) : (
            <div className="mt-4 animate-aparecer">
              <label
                htmlFor={`respuesta-${indice}`}
                className="etiqueta mb-2 block"
              >
                {t.practica.tuRespuesta}
              </label>
              <textarea
                id={`respuesta-${indice}`}
                rows={4}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder={t.practica.marcadorRespuesta}
                translate="no"
                className="notranslate campo font-mono text-[15px] leading-relaxed"
              />
              <button
                type="button"
                onClick={comprobar}
                disabled={comprobando || !respuesta.trim()}
                className="boton-acento mt-3 !px-6 !py-2.5 text-xs"
              >
                {comprobando ? t.practica.comprobando : t.practica.comprobar}
              </button>
              {error && <p className="mt-2 text-xs text-ambar">{error}</p>}
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default function PracticaDirigida({ diagnostico }) {
  const { t, idioma } = useIdioma();
  const { sumar } = useProgreso();
  const [ejercicios, setEjercicios] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [superados, setSuperados] = useState({});

  const detalle = textoMisconception(diagnostico.detalle_misconception, idioma);
  const cuantosSuperados = Object.values(superados).filter(Boolean).length;
  const total = ejercicios?.length || 0;
  const cerrado = total > 0 && cuantosSuperados === total;

  async function generar() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostico, idioma }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error);
      setEjercicios(datos.ejercicios);
      setSuperados({});
    } catch {
      setError(t.practica.error);
    } finally {
      setCargando(false);
    }
  }

  function anotar(indice, ok) {
    // Los puntos se calculan FUERA del actualizador: React puede ejecutar un
    // actualizador más de una vez, y con sumar() dentro se contaban dobles.
    // Solo puntúa la primera vez que se supera cada ejercicio, así que
    // reintentar no sirve para farmear.
    const esNuevo = ok && !superados[indice];
    if (esNuevo) {
      sumar("ejercicioSuperado");
      const trasEste = { ...superados, [indice]: true };
      const cuantos = Object.values(trasEste).filter(Boolean).length;
      if (cuantos === (ejercicios?.length || 0)) sumar("bucleCerrado");
    }
    setSuperados((s) => ({ ...s, [indice]: ok }));
  }

  return (
    <div className="tarjeta p-6 sm:p-8">
      <p className="etiqueta-acento">{t.practica.paso4}</p>
      <h3 className="titulo mt-2 text-2xl font-semibold text-white">
        {t.practica.titulo}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-acero">
        {t.practica.entrada}
        {detalle ? `: ${detalle.nombre.toLowerCase()}.` : "."}
      </p>

      {!ejercicios && (
        <button
          type="button"
          onClick={generar}
          disabled={cargando}
          className="boton-acento mt-5"
        >
          {cargando ? t.practica.generando : t.practica.generar}
        </button>
      )}

      {error && <p className="mt-4 text-sm text-ambar">{error}</p>}

      {ejercicios && (
        <>
          {/* Progreso */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hielo">
              <div
                className="h-full rounded-full bg-gradient-to-r from-electrico to-celeste transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${(cuantosSuperados / total) * 100}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs text-acero">
              {cuantosSuperados}/{total} {t.practica.progreso}
            </span>
          </div>

          <ol className="mt-5 space-y-4">
            {ejercicios.map((ej, i) => (
              <Ejercicio
                key={i}
                ejercicio={ej}
                indice={i}
                diagnostico={diagnostico}
                onResultado={anotar}
              />
            ))}
          </ol>

          {/* Cierre del bucle */}
          {cerrado && (
            <div className="mt-6 animate-aparecer rounded-3xl border border-electrico/40 bg-electrico/10 p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-electrico text-abismo shadow-azul">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
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
              </span>
              <h4 className="titulo mt-4 text-xl font-semibold text-white">
                {t.practica.cerradoTitulo}
              </h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-acero">
                {t.practica.cerradoTexto}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
