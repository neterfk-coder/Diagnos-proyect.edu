"use client";

import { useRef, useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";

function pesoLegible(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ZonaPdf({ onEnviar, cargando }) {
  const { t } = useIdioma();
  const [archivo, setArchivo] = useState(null); // { nombre, peso, base64 }
  const [texto, setTexto] = useState("");
  const [arrastrando, setArrastrando] = useState(false);
  const entrada = useRef(null);

  function leer(f) {
    if (!f || f.type !== "application/pdf") return;
    const lector = new FileReader();
    lector.onload = () => {
      setArchivo({
        nombre: f.name,
        peso: f.size,
        base64: String(lector.result).split(",")[1],
      });
    };
    lector.readAsDataURL(f);
  }

  function enviar() {
    if (!archivo && !texto.trim()) return;
    onEnviar({
      pdfBase64: archivo?.base64 || null,
      texto: archivo ? null : texto.trim(),
    });
  }

  return (
    <div className="tarjeta p-6 sm:p-9">
      {/* Zona de arrastre */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          leer(e.dataTransfer.files?.[0]);
        }}
        className={`rounded-2xl border border-dashed p-8 text-center transition-all duration-300 ${
          arrastrando
            ? "scale-[1.01] border-ambar bg-ambar/10"
            : "border-hielo hover:border-cobalto/50"
        }`}
      >
        {archivo ? (
          <div className="flex flex-col items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ambar/15 text-ambar">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
              </svg>
            </span>
            <div>
              <p className="max-w-xs truncate text-sm font-medium text-tinta">
                {archivo.nombre}
              </p>
              <p className="mt-0.5 font-mono text-xs text-acero">
                {pesoLegible(archivo.peso)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setArchivo(null)}
              className="text-sm text-acero underline underline-offset-4 transition-colors hover:text-cobalto"
            >
              {t.tutor.quitar}
            </button>
          </div>
        ) : (
          <>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-hielo bg-nube text-cobalto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
            </span>
            <p className="mt-4 text-sm text-tinta">{t.tutor.soltar}</p>
            <p className="mt-1 font-mono text-xs text-acero">{t.tutor.limite}</p>
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              className="boton-secundario mt-4"
            >
              {t.tutor.elegir}
            </button>
            <input
              ref={entrada}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => leer(e.target.files?.[0])}
            />
          </>
        )}
      </div>

      {/* Alternativa: pegar texto */}
      <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-etiqueta text-acero">
        <span className="h-px flex-1 bg-hielo" />
        {t.tutor.separador}
        <span className="h-px flex-1 bg-hielo" />
      </div>

      <textarea
        rows={5}
        value={texto}
        disabled={Boolean(archivo)}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={t.tutor.marcadorTexto}
        aria-label={t.tutor.ariaTexto}
        className="campo resize-y leading-relaxed disabled:cursor-not-allowed disabled:opacity-40"
      />

      <button
        type="button"
        onClick={enviar}
        disabled={cargando || (!archivo && !texto.trim())}
        className="boton-acento mt-6 w-full sm:w-auto"
      >
        {cargando ? t.tutor.generando : t.tutor.generar}
      </button>
    </div>
  );
}
