"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cuenta desde 0 hasta el valor final con desaceleración.
 * Un número que sube se lee como un dato vivo; uno estático, como un adorno.
 */
export default function ContadorAnimado({ valor = 0, duracion = 1100, className = "" }) {
  const [actual, setActual] = useState(0);
  const cuadro = useRef(null);

  useEffect(() => {
    if (valor <= 0) {
      setActual(0);
      return;
    }

    // Con animaciones reducidas se salta directo al valor final.
    const reducido =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducido) {
      setActual(valor);
      return;
    }

    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setActual(Math.round(valor * suave));
      if (t < 1) cuadro.current = requestAnimationFrame(paso);
    };

    cuadro.current = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro.current);
  }, [valor, duracion]);

  return (
    <span className={className} aria-label={String(valor)}>
      {actual}
    </span>
  );
}
