"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIdioma } from "@/lib/i18n/contexto";

const PASOS = [
  { n: 1, texto: "3x + 5 = 20", estado: "ok" },
  { n: 2, texto: "3x = 20 + 5", estado: "roto" },
  { n: 3, texto: "3x = 25", estado: "arrastrado" },
  { n: 4, texto: "x = 25/3", estado: "arrastrado" },
];

export default function PanelMarca() {
  const { t } = useIdioma();
  const CLAIMS = t.acceso.claims;
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const reloj = setInterval(
      () => setActivo((i) => (i + 1) % CLAIMS.length),
      5200
    );
    return () => clearInterval(reloj);
  }, [CLAIMS.length]);

  return (
    <aside className="seccion-abisal hidden lg:flex lg:flex-col lg:justify-between">
      {/* Aurora de fondo */}
      <div aria-hidden="true" className="absolute inset-0">
        <span
          className="orbe animate-aurora h-[30rem] w-[30rem] -left-32 -top-32 bg-electrico/30"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="orbe animate-aurora h-[26rem] w-[26rem] -bottom-24 -right-20 bg-[#2E6BD4]/35"
          style={{ animationDelay: "-6s" }}
        />
        <span
          className="orbe animate-aurora h-[20rem] w-[20rem] left-1/3 top-1/2 bg-ambar/15"
          style={{ animationDelay: "-12s" }}
        />
        {/* Retícula tenue */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Marca */}
      <div className="relative z-10 p-12">
        <Link href="/" className="inline-flex items-baseline gap-2.5">
          <span className="titulo text-3xl font-semibold">Diagnos</span>
          <span className="etiqueta-clara">{t.nav.lema}</span>
        </Link>
      </div>

      {/* Traza en vivo */}
      <div className="relative z-10 px-12">
        <div className="max-w-sm animate-flotar-suave rounded-2xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md">
          <div className="mb-5 flex items-center justify-between">
            <p className="etiqueta-clara">{t.acceso.panelEtiqueta}</p>
            <span className="font-mono text-[11px] text-bruma">
              {t.acceso.panelPagina}
            </span>
          </div>

          <ol className="traza-oscura flex flex-col gap-3.5">
            {PASOS.map((p, i) => (
              <li
                key={p.n}
                className="relative animate-entrar-izquierda"
                style={{ animationDelay: `${400 + i * 160}ms` }}
              >
                <span
                  aria-hidden="true"
                  translate="no"
                  className={`traza-punto-oscuro notranslate ${
                    p.estado === "roto" ? "traza-punto-error-oscuro animate-pulso" : ""
                  }`}
                >
                  {p.estado === "roto" ? "!" : p.n}
                </span>
                <p
                  translate="no"
                  className={`notranslate font-mono text-[14px] leading-relaxed ${
                    p.estado === "roto"
                      ? "font-medium text-white"
                      : p.estado === "arrastrado"
                      ? "text-bruma/60 line-through decoration-white/20"
                      : "text-bruma"
                  }`}
                >
                  {p.texto}
                </p>
              </li>
            ))}
          </ol>

          <div
            className="mt-6 animate-aparecer rounded-xl border border-white/10 bg-white/[0.05] p-4"
            style={{ animationDelay: "1200ms" }}
          >
            <p className="etiqueta-clara">{t.acceso.panelMisconception}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/85">
              {t.acceso.panelExplicacion}
            </p>
          </div>
        </div>
      </div>

      {/* Claims rotativos */}
      <div className="relative z-10 p-12">
        <div className="relative h-24 max-w-md">
          {CLAIMS.map((c, i) => (
            <div
              key={c.titulo}
              aria-hidden={i !== activo}
              className={`absolute inset-0 transition-all duration-700 ${
                i === activo
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <p className="titulo text-2xl font-semibold leading-snug">
                {c.titulo}
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-bruma">
                {c.texto}
              </p>
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div className="mt-5 flex gap-2">
          {CLAIMS.map((c, i) => (
            <button
              key={c.titulo}
              type="button"
              onClick={() => setActivo(i)}
              aria-label={`${t.acceso.verMensaje} ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activo ? "w-9 bg-white/80" : "w-4 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
