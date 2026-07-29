"use client";

import { useEffect, useState } from "react";
import CabeceraPagina from "@/components/CabeceraPagina";
import RevelarAlScroll from "@/components/RevelarAlScroll";
import ZonaPdf from "@/components/tutor/ZonaPdf";
import Pestanas from "@/components/tutor/Pestanas";
import Flashcard from "@/components/tutor/Flashcard";
import { useIdioma } from "@/lib/i18n/contexto";
import { useProgreso } from "@/lib/progreso";

export default function Tutor() {
  const { t, idioma } = useIdioma();
  const { sumar } = useProgreso();
  const [material, setMaterial] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [fase, setFase] = useState(0);
  const [pestana, setPestana] = useState(0);
  const [carta, setCarta] = useState(0);
  const [pistas, setPistas] = useState({});

  // Mensajes de progreso: el proceso tarda unos segundos y una pantalla
  // quieta se percibe como colgada.
  useEffect(() => {
    if (!cargando) return;
    setFase(0);
    const reloj = setInterval(
      () => setFase((f) => Math.min(f + 1, t.tutor.fases.length - 1)),
      1600
    );
    return () => clearInterval(reloj);
  }, [cargando, t.tutor.fases.length]);

  async function generar({ texto, paginas, caracteres, binario }) {
    setCargando(true);
    setError(null);
    setMaterial(null);
    try {
      // Lo normal es mandar el texto que ya extrajo el navegador. Solo si
      // eso falló se sube el archivo, y entonces va en binario.
      const res = binario
        ? await fetch("/api/tutor", {
            method: "POST",
            headers: { "Content-Type": "application/pdf", "x-idioma": idioma },
            body: binario,
          })
        : await fetch("/api/tutor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto, paginas, caracteres, idioma }),
          });
      const json = await res.json();
      if (!res.ok) {
        setError(t.tutor.errores[json.codigo] || t.tutor.errores.generico);
        return;
      }
      setMaterial(json);
      sumar("materialEstudio");
      setPestana(0);
      setCarta(0);
      setPistas({});
    } catch {
      setError(t.tutor.errores.generico);
    } finally {
      setCargando(false);
    }
  }

  const pestanas = material
    ? [
        { id: "resumen", texto: t.tutor.pestanas.resumen },
        {
          id: "puntos",
          texto: t.tutor.pestanas.puntos,
          cuenta: material.puntosClave.length,
        },
        {
          id: "flashcards",
          texto: t.tutor.pestanas.flashcards,
          cuenta: material.flashcards.length,
        },
        {
          id: "ejercicios",
          texto: t.tutor.pestanas.ejercicios,
          cuenta: material.ejercicios.length,
        },
      ]
    : [];

  const totalCartas = material?.flashcards.length || 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <CabeceraPagina
        etiqueta={t.tutor.etiqueta}
        titulo={t.tutor.titulo}
        entrada={t.tutor.entrada}
      />

      {!material && (
        <div className="mt-12">
          <ZonaPdf onEnviar={generar} cargando={cargando} />

          {cargando && (
            <div className="tarjeta mt-6 flex items-center gap-4 p-6">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 animate-girar text-cobalto"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="2.5"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <p key={fase} className="animate-aparecer text-sm text-tinta">
                {t.tutor.fases[fase]}
              </p>
            </div>
          )}

          {error && (
            <div className="tarjeta mt-6 border-ambar/40 p-6">
              <p className="etiqueta text-ambar">{t.tutor.errorTitulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-tinta">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* ================= RESULTADO ================= */}
      {material && (
        <div className="mt-12 animate-aparecer">
          <div className="tarjeta p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="etiqueta">{t.tutor.etiqueta}</p>
                <h2 className="titulo mt-1.5 text-2xl font-semibold text-white sm:text-3xl">
                  {material.titulo}
                </h2>
                <p className="mt-2 font-mono text-xs text-acero">
                  {material.meta.paginas > 0 &&
                    `${material.meta.paginas} ${t.tutor.paginas} · `}
                  {material.meta.caracteres.toLocaleString()} {t.tutor.caracteres}
                  {material.meta.partes > 1 &&
                    ` · ${t.tutor.leidoEn} ${material.meta.partes} ${t.tutor.partes}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaterial(null);
                  setError(null);
                }}
                className="boton-secundario shrink-0 !px-5 !py-2 text-xs"
              >
                {t.tutor.otro}
              </button>
            </div>

            {(material.meta.recortado || material.meta.partesFallidas > 0) && (
              <div className="mt-4 space-y-2">
                {material.meta.recortado && (
                  <p className="rounded-2xl border border-ambar/30 bg-ambar/10 px-4 py-2.5 text-xs text-ambar">
                    {t.tutor.recortado}
                  </p>
                )}
                {material.meta.partesFallidas > 0 && (
                  <p className="rounded-2xl border border-hielo bg-nube px-4 py-2.5 text-xs text-acero">
                    {material.meta.partesFallidas}{" "}
                    {material.meta.partesFallidas === 1
                      ? t.tutor.parteFallida
                      : t.tutor.partesFallidas}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8">
            <Pestanas opciones={pestanas} activa={pestana} onCambiar={setPestana} />
          </div>

          <div className="mt-8">
            {/* ---------- Resumen ---------- */}
            {pestana === 0 && (
              <div className="tarjeta animate-aparecer space-y-4 p-6 sm:p-9">
                {material.resumen
                  .split(/\n\n+/)
                  .filter(Boolean)
                  .map((p, i) => (
                    <p
                      key={i}
                      className="text-[15px] font-light leading-relaxed text-tinta"
                    >
                      {p}
                    </p>
                  ))}
              </div>
            )}

            {/* ---------- Puntos clave ---------- */}
            {pestana === 1 && (
              <ul className="grid animate-aparecer gap-4 sm:grid-cols-2">
                {material.puntosClave.map((p, i) => (
                  <RevelarAlScroll
                    as="li"
                    key={i}
                    retraso={(i % 2) * 80}
                    className="tarjeta tarjeta-viva p-6"
                  >
                    <span className="titulo text-3xl font-semibold leading-none text-hielo">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="titulo mt-3 text-lg font-semibold text-white">
                      {p.titulo}
                    </h3>
                    <p className="mt-1.5 text-sm font-light leading-relaxed text-acero">
                      {p.detalle}
                    </p>
                  </RevelarAlScroll>
                ))}
              </ul>
            )}

            {/* ---------- Flashcards ---------- */}
            {pestana === 2 && totalCartas > 0 && (
              <div className="animate-aparecer">
                <Flashcard
                  tarjeta={material.flashcards[carta]}
                  indice={carta}
                  total={totalCartas}
                />

                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCarta((c) => Math.max(0, c - 1))}
                    disabled={carta === 0}
                    className="boton-secundario !px-5 !py-2 text-xs disabled:opacity-40"
                  >
                    {t.tutor.anterior}
                  </button>

                  {/* Indicadores: también sirven para saltar de tarjeta */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {material.flashcards.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCarta(i)}
                        aria-label={`${t.tutor.tarjeta} ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === carta
                            ? "w-7 bg-ambar"
                            : "w-1.5 bg-hielo hover:bg-acero"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCarta((c) => Math.min(totalCartas - 1, c + 1))
                    }
                    disabled={carta === totalCartas - 1}
                    className="boton-secundario !px-5 !py-2 text-xs disabled:opacity-40"
                  >
                    {t.tutor.siguiente}
                  </button>
                </div>
              </div>
            )}

            {/* ---------- Ejercicios ---------- */}
            {pestana === 3 && (
              <ol className="animate-aparecer space-y-4">
                {material.ejercicios.map((e, i) => (
                  <RevelarAlScroll
                    as="li"
                    key={i}
                    retraso={i * 90}
                    className="tarjeta p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[15px] leading-relaxed text-tinta">
                        {e.enunciado}
                      </p>
                      <span className="titulo shrink-0 text-2xl font-semibold leading-none text-hielo">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {e.pista && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setPistas((p) => ({ ...p, [i]: !p[i] }))
                          }
                          className="mt-4 text-xs text-cobalto underline underline-offset-4 transition-colors hover:text-celeste"
                        >
                          {pistas[i] ? t.tutor.ocultarPista : t.tutor.verPista}
                        </button>
                        {pistas[i] && (
                          <p className="mt-3 animate-aparecer border-l-2 border-ambar/50 pl-3 text-sm text-acero">
                            {e.pista}
                          </p>
                        )}
                      </>
                    )}
                  </RevelarAlScroll>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
