"use client";

import Link from "next/link";
import Traza from "@/components/Traza";
import RevelarAlScroll from "@/components/RevelarAlScroll";
import { CATALOGO, buscarPorCodigo, textoMisconception } from "@/lib/misconceptions";
import { useIdioma } from "@/lib/i18n/contexto";

const pasosDemo = [
  { n: 1, texto: "3x + 5 = 20", estado: "correcto" },
  { n: 2, texto: "3x = 20 + 5", estado: "erroneo" },
  { n: 3, texto: "3x = 25", estado: "arrastrado" },
  { n: 4, texto: "x = 25/3", estado: "arrastrado" },
];

/** Distribución de ejemplo del aula demo que se ve en la portada. */
const AULA_DEMO = [
  ["SIG-01", 78],
  ["SIG-02", 52],
  ["EQU-01", 34],
  ["FRA-01", 21],
];

export default function Inicio() {
  const { t, idioma } = useIdioma();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="seccion-abisal">
        {/* Retícula tenue sobre el azul abisal */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 60% 20%, #000 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 60% 20%, #000 20%, transparent 85%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-aparecer">
            <p className="etiqueta-clara">{t.inicio.etiqueta}</p>
            <h1 className="titulo mt-5 text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              {t.inicio.titulo1}
              <br />
              <em className="titulo-gradiente-claro">{t.inicio.titulo2}</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-bruma">
              {t.inicio.entrada}{" "}
              <span className="font-normal text-white">{t.inicio.entradaEnfasis}</span>
              {t.inicio.entradaFin}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/analizar" className="boton-acento">
                {t.inicio.ctaAnalizar}
              </Link>
              <Link href="/docente" className="boton-secundario-claro">
                {t.inicio.ctaDocente}
              </Link>
            </div>
            <p className="mt-6 text-sm text-bruma/80">{t.inicio.notaCta}</p>
          </div>

          {/* Firma visual: la traza en vivo, en blanco sobre el azul */}
          <div className="animate-aparecer relative [animation-delay:200ms]">
            {/* Halo giratorio: el detalle que hace que la tarjeta flote */}
            <div className="absolute -inset-6 overflow-hidden rounded-[2.5rem]" aria-hidden="true">
              <div className="halo-orbital animate-orbitar blur-2xl" />
            </div>

            <div className="tarjeta tarjeta-viva relative p-7 shadow-tarjeta sm:p-9">
              <div className="mb-6 flex items-center justify-between">
                <p className="etiqueta-acento">{t.inicio.tarjetaEtiqueta}</p>
                <span className="font-mono text-xs text-acero">
                  {t.inicio.tarjetaPagina}
                </span>
              </div>
              <Traza pasos={pasosDemo} pasoRoto={2} />
              <div className="mt-7 rounded-2xl bg-nube p-4">
                <p className="etiqueta">{t.inicio.tarjetaMisconception}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta">
                  {t.inicio.tarjetaExplicacion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EL PROBLEMA ================= */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
        <p className="etiqueta-acento">{t.inicio.problemaEtiqueta}</p>
        <h2 className="titulo mt-4 text-3xl font-semibold leading-snug text-white sm:text-4xl">
          {t.inicio.problemaTitulo}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-acero">
          {t.inicio.problemaTexto1}{" "}
          <em className="titulo text-tinta">{t.inicio.problemaEnfasis}</em>
          {t.inicio.problemaTexto2}
        </p>
      </section>

      <div className="divisor" />

      {/* ================= MÉTODO ================= */}
      <section id="metodo" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-24">
        <p className="etiqueta-acento text-center">{t.inicio.metodoEtiqueta}</p>
        <h2 className="titulo mt-4 text-center text-3xl font-semibold text-white sm:text-4xl">
          {t.inicio.metodoTitulo}
        </h2>
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {t.inicio.metodo.map((p, i) => (
            <RevelarAlScroll key={p.titulo} retraso={i * 110} className="flex gap-5">
              <span className="titulo mt-0.5 text-4xl font-semibold leading-none text-ambar/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="titulo text-xl font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-acero">
                  {p.detalle}
                </p>
              </div>
            </RevelarAlScroll>
          ))}
        </div>
      </section>

      {/* ================= CATÁLOGO (sección oscura) ================= */}
      <section className="seccion-abisal">
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="etiqueta-clara">{t.inicio.catalogoEtiqueta}</p>
              <h2 className="titulo mt-4 text-3xl font-semibold leading-snug sm:text-4xl">
                {t.inicio.catalogoTitulo}
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-bruma">
                {t.inicio.catalogoTexto}
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {CATALOGO.slice(0, 6).map((m) => (
                <li
                  key={m.codigo}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
                >
                  <p translate="no" className="notranslate font-mono text-xs text-bruma">
                    {m.codigo}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {textoMisconception(m, idioma).nombre}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= DOCENTES ================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="etiqueta-acento">{t.inicio.docenteEtiqueta}</p>
            <h2 className="titulo mt-4 text-3xl font-semibold leading-snug text-white sm:text-4xl">
              {t.inicio.docenteTitulo}
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed text-acero">
              {t.inicio.docenteTexto}
            </p>
            <Link href="/docente" className="boton-primario mt-7">
              {t.inicio.docenteCta}
            </Link>
          </div>
          <div className="tarjeta tarjeta-viva p-7">
            <p className="etiqueta">{t.inicio.docenteDemoEtiqueta}</p>
            <div className="mt-5 space-y-4">
              {AULA_DEMO.map(([codigo, pct]) => (
                <div key={codigo}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-4">
                    <p className="text-sm text-tinta">
                      {codigo} ·{" "}
                      {textoMisconception(buscarPorCodigo(codigo), idioma).nombre}
                    </p>
                    <p className="font-mono text-xs text-acero">{pct}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-nube">
                    <div className="barra-calor" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CIERRE ================= */}
      <section className="seccion-abisal">
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-28">
          <h2 className="titulo text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {t.inicio.cierreTitulo1}
            <br />
            <em className="titulo-gradiente-claro">{t.inicio.cierreTitulo2}</em>
          </h2>
          <Link
            href="/analizar"
            className="boton-acento mt-10 !px-9 !py-4 text-base"
          >
            {t.inicio.cierreCta}
          </Link>
        </div>
      </section>
    </>
  );
}
