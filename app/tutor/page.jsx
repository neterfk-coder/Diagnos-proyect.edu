"use client";

import { useState } from "react";
import CabeceraPagina from "@/components/CabeceraPagina";
import RevelarAlScroll from "@/components/RevelarAlScroll";
import ZonaPdf from "@/components/tutor/ZonaPdf";
import Pestanas from "@/components/tutor/Pestanas";
import Flashcard from "@/components/tutor/Flashcard";
import MapaMental from "@/components/tutor/MapaMental";
import Quiz from "@/components/tutor/Quiz";
import AnalizandoPdf from "@/components/tutor/AnalizandoPdf";
import { useIdioma } from "@/lib/i18n/contexto";
import { useProgreso } from "@/lib/progreso";

export default function Tutor() {
  const { t, idioma } = useIdioma();
  const { sumar } = useProgreso();
  const [material, setMaterial] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [pestana, setPestana] = useState(0);
  const [carta, setCarta] = useState(0);
  const [pistas, setPistas] = useState({});
  const [breve, setBreve] = useState(true);
  const [enCurso, setEnCurso] = useState(null); // datos reales del documento

  async function generar({ texto, paginas, caracteres, binario }) {
    setCargando(true);
    setError(null);
    setMaterial(null);
    // Lo que ya sabemos del documento, para que la espera muestre cifras
    // reales en vez de un porcentaje inventado.
    setEnCurso({
      paginas,
      caracteres,
      partes: Math.min(4, Math.max(1, Math.ceil((caracteres || 0) / 12000))),
    });
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

  // Las pestañas que no traen contenido no se muestran, para no dejar
  // secciones vacías si el modelo devolvió menos de lo pedido.
  const pestanas = material
    ? [
        { id: "resumen", texto: t.tutor.pestanas.resumen },
        material.mapa && { id: "mapa", texto: t.tutor.pestanaMapa },
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
        material.quiz?.length > 0 && {
          id: "quiz",
          texto: t.tutor.pestanaQuiz,
          cuenta: material.quiz.length,
        },
        {
          id: "ejercicios",
          texto: t.tutor.pestanas.ejercicios,
          cuenta: material.ejercicios.length,
        },
      ].filter(Boolean)
    : [];

  const activa = pestanas[pestana]?.id;

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
            <AnalizandoPdf
              paginas={enCurso?.paginas}
              caracteres={enCurso?.caracteres}
              partes={enCurso?.partes}
            />
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
            {activa === "resumen" && (
              <div className="animate-aparecer">
                {/* Breve o completo: leer tres párrafos cuando buscabas la
                    idea principal es lo que hace abandonar un resumen. */}
                {material.resumenCorto && (
                  <div className="mb-4 inline-flex rounded-full border border-hielo bg-nube p-1">
                    {[
                      { id: true, texto: t.tutor.resumenBreve },
                      { id: false, texto: t.tutor.resumenCompleto },
                    ].map((o) => (
                      <button
                        key={String(o.id)}
                        type="button"
                        onClick={() => setBreve(o.id)}
                        aria-pressed={breve === o.id}
                        className={`rounded-full px-4 py-1.5 text-xs transition-all duration-300 ${
                          breve === o.id
                            ? "bg-ambar font-semibold text-abismo"
                            : "text-acero hover:text-tinta"
                        }`}
                      >
                        {o.texto}
                      </button>
                    ))}
                  </div>
                )}

                <div className="tarjeta space-y-4 p-6 sm:p-9">
                  {(breve && material.resumenCorto
                    ? [material.resumenCorto]
                    : material.resumen.split(/\n\n+/).filter(Boolean)
                  ).map((p, i) => (
                    <p
                      key={i}
                      className={`font-light leading-relaxed text-tinta ${
                        breve && material.resumenCorto
                          ? "text-lg sm:text-xl"
                          : "text-[15px]"
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- Mapa mental ---------- */}
            {activa === "mapa" && material.mapa && (
              <div className="animate-aparecer">
                <MapaMental mapa={material.mapa} />
                <p className="mt-3 px-1 text-xs text-acero">{t.tutor.mapaAyuda}</p>
              </div>
            )}

            {/* ---------- Cuestionario ---------- */}
            {activa === "quiz" && material.quiz?.length > 0 && (
              <Quiz preguntas={material.quiz} />
            )}

            {/* ---------- Puntos clave ---------- */}
            {activa === "puntos" && (
              <ul className="grid animate-aparecer gap-4 sm:grid-cols-2">
                {material.puntosClave.map((p, i) => (
                  <RevelarAlScroll
                    as="li"
                    key={i}
                    retraso={(i % 2) * 80}
                    className="tarjeta tarjeta-viva p-6"
                  >
                    <span className="titulo text-3xl font-semibold leading-none text-ambar/35">
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
            {activa === "flashcards" && totalCartas > 0 && (
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
            {activa === "ejercicios" && (
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
                      <span className="titulo shrink-0 text-2xl font-semibold leading-none text-ambar/35">
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
