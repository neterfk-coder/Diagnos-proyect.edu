"use client";

import { useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";

/**
 * Campo de formulario con etiqueta flotante.
 * El truco del placeholder=" " permite usar :placeholder-shown para
 * saber si el campo está vacío sin JavaScript adicional.
 */
export default function CampoFlotante({
  id,
  etiqueta,
  tipo = "text",
  valor,
  onChange,
  error,
  autoComplete,
  requerido = false,
  retraso = 0,
}) {
  const { t } = useIdioma();
  const [visible, setVisible] = useState(false);
  const esClave = tipo === "password";
  const tipoReal = esClave && visible ? "text" : tipo;

  return (
    <div
      className="animate-aparecer"
      style={{ animationDelay: `${retraso}ms` }}
    >
      <div className={`relative ${error ? "animate-temblar" : ""}`}>
        <input
          id={id}
          name={id}
          type={tipoReal}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          autoComplete={autoComplete}
          required={requerido}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`peer campo-flotante ${error ? "campo-flotante-error" : ""} ${
            esClave ? "pr-12" : ""
          }`}
        />
        <label htmlFor={id} className="etiqueta-flotante">
          {etiqueta}
        </label>

        {esClave && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t.acceso.ocultarClave : t.acceso.mostrarClave}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-acero transition-colors hover:text-cobalto focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalto"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
              {!visible && <path d="m4 20 16-16" />}
            </svg>
          </button>
        )}
      </div>

      {/* Altura reservada: el mensaje de error no desplaza el formulario */}
      <div className="h-5 pl-1 pt-1">
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="animate-aparecer text-xs text-ambar"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
