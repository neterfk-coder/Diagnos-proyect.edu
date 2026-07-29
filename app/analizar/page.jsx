"use client";

import { useState } from "react";
import ZonaCarga from "@/components/ZonaCarga";
import Traza from "@/components/Traza";
import ChatSocratico from "@/components/ChatSocratico";
import PracticaDirigida from "@/components/PracticaDirigida";
import { useIdioma } from "@/lib/i18n/contexto";
import { textoMisconception } from "@/lib/misconceptions";
import { crearJWT } from "@/lib/cuenta";
import { useProgreso } from "@/lib/progreso";

export default function Analizar() {
  const { t, idioma } = useIdioma();
  const { sumar } = useProgreso();
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  async function analizar(datos) {
    setCargando(true);
    setError(null);
    setDiagnostico(null);
    // La función tiene 60 s en producción. Se corta antes para poder dar un
    // mensaje propio en vez de la página de error de la plataforma.
    const corte = new AbortController();
    const reloj = setTimeout(() => corte.abort(), 55000);

    try {
      // El servidor deduce el aula de este token, no de lo que le mandemos:
      // así un estudiante no puede colar diagnósticos en otra clase.
      const jwt = await crearJWT();
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, idioma, jwt }),
        signal: corte.signal,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDiagnostico(json);
      sumar("diagnostico");
    } catch (e) {
      setError(
        e.name === "AbortError" ? t.analizar.errorLento : e.message || t.analizar.errorGenerico
      );
    } finally {
      clearTimeout(reloj);
      setCargando(false);
    }
  }

  const detalle = diagnostico
    ? textoMisconception(diagnostico.detalle_misconception, idioma)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="etiqueta">{t.analizar.etiqueta}</p>
        <h1 className="titulo mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {t.analizar.titulo}
        </h1>
        <p className="mt-3 text-base font-light leading-relaxed text-acero">
          {t.analizar.entrada}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <ZonaCarga onAnalizar={analizar} cargando={cargando} />

          {error && (
            <div className="tarjeta border-ambar/40 p-5 text-sm text-tinta">
              <p className="etiqueta text-ambar">{t.analizar.errorTitulo}</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {diagnostico && (
            <div className="tarjeta tarjeta-viva animate-aparecer p-6 sm:p-8">
              <p className="etiqueta">{t.analizar.paso2}</p>
              <h2 className="titulo mt-2 text-2xl font-semibold">
                {diagnostico.procedimiento_correcto
                  ? t.analizar.tituloCorrecto
                  : t.analizar.tituloError}
              </h2>
              {diagnostico.ejercicio && (
                <p translate="no" className="notranslate mt-1 font-mono text-sm text-acero">
                  {diagnostico.ejercicio}
                </p>
              )}

              <div className="mt-6">
                <Traza
                  pasos={diagnostico.pasos || []}
                  pasoRoto={diagnostico.paso_roto}
                />
              </div>

              {!diagnostico.procedimiento_correcto && (
                <div className="mt-7 rounded-xl bg-nube p-5">
                  <p className="etiqueta">
                    {t.analizar.misconception} · {diagnostico.misconception}
                  </p>
                  {detalle && (
                    <p className="titulo mt-1 text-lg font-semibold">
                      {detalle.nombre}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-tinta">
                    {diagnostico.explicacion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {diagnostico && !diagnostico.procedimiento_correcto ? (
            <>
              <div className="min-h-[480px]">
                <ChatSocratico diagnostico={diagnostico} />
              </div>
              <PracticaDirigida diagnostico={diagnostico} />
            </>
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-hielo p-10 text-center">
              <div>
                <p className="titulo text-2xl font-semibold text-hielo">
                  {t.analizar.esperandoTitulo}
                </p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-acero">
                  {t.analizar.esperandoTexto}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
