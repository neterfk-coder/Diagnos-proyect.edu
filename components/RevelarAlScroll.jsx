"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revela su contenido cuando entra en pantalla.
 * Se dispara una sola vez por elemento: nada de parpadeos al subir y bajar.
 */
export default function RevelarAlScroll({
  children,
  retraso = 0,
  className = "",
  as: Etiqueta = "div",
  ...resto
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    // Sin IntersectionObserver (o con animaciones reducidas) se muestra ya.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref}
      className={`${visible ? "animate-revelar" : "opacity-0"} ${className}`}
      style={visible && retraso ? { animationDelay: `${retraso}ms` } : undefined}
      {...resto}
    >
      {children}
    </Etiqueta>
  );
}
