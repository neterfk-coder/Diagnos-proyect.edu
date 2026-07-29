"use client";

import { useEffect, useRef, useState } from "react";
import { useIdioma } from "@/lib/i18n/contexto";
import { useProgreso } from "@/lib/progreso";

export default function ChatSocratico({ diagnostico, onDescubierto }) {
  const { t, idioma } = useIdioma();
  const { sumar } = useProgreso();
  const [historial, setHistorial] = useState([
    { rol: "tutor", texto: diagnostico.pregunta_inicial },
  ]);
  const [entrada, setEntrada] = useState("");
  const [pensando, setPensando] = useState(false);
  const [descubierto, setDescubierto] = useState(false);
  const finChat = useRef(null);

  useEffect(() => {
    finChat.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [historial, pensando]);

  async function enviar() {
    const texto = entrada.trim();
    if (!texto || pensando || descubierto) return;

    const nuevoHistorial = [...historial, { rol: "estudiante", texto }];
    setHistorial(nuevoHistorial);
    setEntrada("");
    setPensando(true);

    try {
      const res = await fetch("/api/socratic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostico, historial: nuevoHistorial, idioma }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error);

      setHistorial((h) => [...h, { rol: "tutor", texto: datos.texto }]);
      if (datos.descubierto) {
        setDescubierto(true);
        sumar("descubrimiento");
        onDescubierto?.();
      }
    } catch {
      setHistorial((h) => [...h, { rol: "tutor", texto: t.chat.errorRed }]);
    } finally {
      setPensando(false);
    }
  }

  return (
    <div className="tarjeta flex h-full flex-col overflow-hidden">
      <div className="border-b border-hielo bg-nube px-6 py-4">
        <p className="etiqueta-acento">{t.chat.paso3}</p>
        <h3 className="titulo mt-1 text-xl font-semibold">{t.chat.titulo}</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5" aria-live="polite">
        {historial.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] animate-aparecer rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.rol === "tutor"
                ? "bg-nube text-tinta"
                : "ml-auto bg-electrico text-abismo"
            }`}
          >
            {m.texto}
          </div>
        ))}
        {pensando && (
          <div className="max-w-[85%] rounded-2xl bg-nube px-4 py-3 text-sm text-acero">
            {t.chat.pensando}
          </div>
        )}
        {descubierto && (
          <div className="rounded-xl border border-cobalto/30 bg-nube px-4 py-3 text-center text-sm font-medium text-cobalto">
            {t.chat.descubierto}
          </div>
        )}
        <div ref={finChat} />
      </div>

      <div className="border-t border-hielo p-4">
        <div className="flex gap-2">
          <input
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviar()}
            placeholder={descubierto ? t.chat.completado : t.chat.marcador}
            disabled={descubierto}
            className="campo"
            aria-label={t.chat.ariaEntrada}
          />
          <button
            type="button"
            onClick={enviar}
            disabled={pensando || descubierto || !entrada.trim()}
            className="boton-primario shrink-0 !px-5"
          >
            {t.chat.enviar}
          </button>
        </div>
      </div>
    </div>
  );
}
