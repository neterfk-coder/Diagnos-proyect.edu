"use client";

import { useRef, useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";

export default function ZonaCarga({ onAnalizar, cargando }) {
  const { t } = useIdioma();
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null); // { base64, tipo, previa }
  const [arrastrando, setArrastrando] = useState(false);
  const inputArchivo = useRef(null);

  /**
   * Reduce la foto antes de enviarla. Una imagen de móvil son varios miles
   * de píxeles de lado; el modelo de visión la escala igualmente, así que
   * mandarla entera solo añade tokens, latencia y riesgo de que la función
   * agote su tiempo. 1400 px de lado largo conserva de sobra la letra a mano.
   */
  function reducir(archivo) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(archivo);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        const LADO = 1400;
        const escala = Math.min(1, LADO / Math.max(img.width, img.height));

        // Ya es pequeña: no merece la pena recomprimirla y perder nitidez
        if (escala === 1 && archivo.size < 900 * 1024) {
          const lector = new FileReader();
          lector.onload = () =>
            resolve({ datos: String(lector.result), tipo: archivo.type });
          lector.readAsDataURL(archivo);
          return;
        }

        const lienzo = document.createElement("canvas");
        lienzo.width = Math.round(img.width * escala);
        lienzo.height = Math.round(img.height * escala);
        const ctx = lienzo.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
        resolve({ datos: lienzo.toDataURL("image/jpeg", 0.85), tipo: "image/jpeg" });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("imagen ilegible"));
      };
      img.src = url;
    });
  }

  async function leerArchivo(archivo) {
    if (!archivo || !archivo.type.startsWith("image/")) return;
    try {
      const { datos, tipo } = await reducir(archivo);
      setImagen({ base64: datos.split(",")[1], tipo, previa: datos });
    } catch {
      /* si la reducción falla se ignora el archivo, no se sube en crudo */
    }
  }

  function enviar() {
    if (!texto.trim() && !imagen) return;
    onAnalizar({
      texto: texto.trim() || null,
      imagenBase64: imagen?.base64 || null,
      tipoImagen: imagen?.tipo || null,
    });
  }

  return (
    <div className="tarjeta p-6 sm:p-8">
      <p className="etiqueta-acento">{t.zonaCarga.paso1}</p>
      <h2 className="titulo mt-2 text-2xl font-semibold">{t.zonaCarga.titulo}</h2>
      <p className="mt-2 text-sm leading-relaxed text-acero">
        {t.zonaCarga.entrada}
      </p>

      {/* Foto del cuaderno */}
      <div
        className={`mt-6 rounded-xl border border-dashed p-6 text-center transition-colors ${
          arrastrando ? "border-cobalto bg-nube" : "border-hielo"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          leerArchivo(e.dataTransfer.files?.[0]);
        }}
      >
        {imagen ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagen.previa}
              alt={t.zonaCarga.altPrevia}
              className="max-h-56 rounded-lg border border-hielo object-contain"
            />
            <button
              type="button"
              onClick={() => setImagen(null)}
              className="text-sm text-acero underline underline-offset-4 hover:text-cobalto"
            >
              {t.zonaCarga.quitar}
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-acero">{t.zonaCarga.arrastra}</p>
            <button
              type="button"
              onClick={() => inputArchivo.current?.click()}
              className="boton-secundario mt-3"
            >
              {t.zonaCarga.elegir}
            </button>
            <input
              ref={inputArchivo}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => leerArchivo(e.target.files?.[0])}
            />
          </>
        )}
      </div>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-etiqueta text-acero">
        <span className="h-px flex-1 bg-hielo" /> {t.zonaCarga.separador}{" "}
        <span className="h-px flex-1 bg-hielo" />
      </div>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={5}
        placeholder={"3x + 5 = 20\n3x = 20 + 5\n3x = 25\nx = 25/3"}
        translate="no"
        className="notranslate campo font-mono text-[15px] leading-relaxed"
        aria-label={t.zonaCarga.ariaTexto}
      />

      <button
        type="button"
        onClick={enviar}
        disabled={cargando || (!texto.trim() && !imagen)}
        className="boton-acento mt-5 w-full sm:w-auto"
      >
        {cargando ? t.zonaCarga.enviando : t.zonaCarga.enviar}
      </button>
    </div>
  );
}
