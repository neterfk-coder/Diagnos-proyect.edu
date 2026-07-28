"use client";

import { useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";
import { textoMisconception } from "@/lib/misconceptions";

export default function PracticaDirigida({ diagnostico }) {
  const { t, idioma } = useIdioma();
  const [ejercicios, setEjercicios] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [pistaVisible, setPistaVisible] = useState({});

  const detalle = textoMisconception(diagnostico.detalle_misconception, idioma);

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
    } catch {
      setError(t.practica.error);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="tarjeta p-6 sm:p-8">
      <p className="etiqueta">{t.practica.paso4}</p>
      <h3 className="titulo mt-2 text-2xl font-semibold">{t.practica.titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-acero">
        {t.practica.entrada}
        {detalle ? `: ${detalle.nombre.toLowerCase()}.` : "."}
      </p>

      {!ejercicios && (
        <button
          type="button"
          onClick={generar}
          disabled={cargando}
          className="boton-primario mt-5"
        >
          {cargando ? t.practica.generando : t.practica.generar}
        </button>
      )}

      {error && <p className="mt-4 text-sm text-ambar">{error}</p>}

      {ejercicios && (
        <ol className="mt-6 space-y-4">
          {ejercicios.map((ej, i) => (
            <li
              key={i}
              className="animate-aparecer rounded-xl border border-hielo bg-nube p-5"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="etiqueta">
                  {t.practica.niveles[ej.nivel] || ej.nivel}
                </span>
                <button
                  type="button"
                  onClick={() => setPistaVisible((p) => ({ ...p, [i]: !p[i] }))}
                  className="text-xs text-cobalto underline underline-offset-4"
                >
                  {pistaVisible[i] ? t.practica.ocultarPista : t.practica.verPista}
                </button>
              </div>
              <p translate="no" className="notranslate mt-2 font-mono text-[15px] text-tinta">
                {ej.enunciado}
              </p>
              {pistaVisible[i] && (
                <p className="mt-3 border-l-2 border-cobalto/40 pl-3 text-sm text-acero">
                  {ej.pista}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
