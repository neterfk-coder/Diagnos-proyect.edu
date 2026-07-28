"use client";

import CabeceraPagina from "@/components/CabeceraPagina";
import Acordeon from "@/components/Acordeon";
import RevelarAlScroll from "@/components/RevelarAlScroll";
import { useIdioma } from "@/lib/i18n/contexto";
import { CATALOGO, textoMisconception } from "@/lib/misconceptions";

export default function Ayuda() {
  const { t, idioma } = useIdioma();
  const a = t.paginas.ayuda;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <CabeceraPagina etiqueta={a.etiqueta} titulo={a.titulo} entrada={a.entrada} />

      {/* ---------- Primeros pasos ---------- */}
      <section className="mt-16">
        <h2 className="titulo text-2xl font-semibold">{a.empezar.titulo}</h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          {a.empezar.pasos.map((p, i) => (
            <RevelarAlScroll
              key={p.titulo}
              retraso={i * 110}
              className="tarjeta tarjeta-viva p-6"
            >
              <span className="titulo text-3xl font-semibold leading-none text-hielo">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="titulo mt-3 text-lg font-semibold">{p.titulo}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-acero">
                {p.texto}
              </p>
            </RevelarAlScroll>
          ))}
        </div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
      <section id="faq" className="mt-16 scroll-mt-24">
        <h2 className="titulo text-2xl font-semibold">{a.faq.titulo}</h2>
        <div className="mt-6">
          <Acordeon elementos={a.faq.preguntas} />
        </div>
      </section>

      {/* ---------- Catálogo completo ---------- */}
      <section id="catalogo" className="mt-16 scroll-mt-24">
        <h2 className="titulo text-2xl font-semibold">{a.catalogo.titulo}</h2>
        <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-acero">
          {a.catalogo.entrada}
        </p>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {CATALOGO.map((m, i) => {
            const d = textoMisconception(m, idioma);
            return (
              <RevelarAlScroll
                as="li"
                key={m.codigo}
                retraso={(i % 2) * 80}
                className="tarjeta tarjeta-viva p-5"
              >
                <p translate="no" className="notranslate font-mono text-xs text-cobalto">
                  {m.codigo}
                </p>
                <p className="mt-1.5 text-sm font-medium text-tinta">{d.nombre}</p>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-acero">
                  {d.descripcion}
                </p>
              </RevelarAlScroll>
            );
          })}
        </ul>
      </section>

      {/* ---------- Accesibilidad ---------- */}
      <section id="accesibilidad" className="mt-16 scroll-mt-24">
        <h2 className="titulo text-2xl font-semibold">{a.accesibilidad.titulo}</h2>
        <div className="mt-5 space-y-4">
          {a.accesibilidad.parrafos.map((p) => (
            <p key={p} className="text-sm font-light leading-relaxed text-acero">
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
