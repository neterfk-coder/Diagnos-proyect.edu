"use client";

import { useEffect, useRef } from "react";

/** Distancia máxima a la que dos partículas se unen con una línea. */
const ENLACE = 132;
/** Radio de influencia del cursor. */
const IMAN = 170;

/**
 * Campo de partículas en constelación.
 *
 * Va en canvas y no en CSS porque hay que recalcular cada fotograma qué
 * pares de partículas están lo bastante cerca como para unirse — eso no se
 * puede expresar con hojas de estilo.
 *
 * Las que quedan cerca del cursor se tiñen del naranja de acento y se apartan
 * despacio, así el fondo responde al ratón sin robar atención al contenido.
 */
export default function CampoParticulas() {
  const lienzoRef = useRef(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return;

    const reducido = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let ancho = 0;
    let alto = 0;
    let particulas = [];
    let cuadro = null;
    let vivo = true;
    const raton = { x: -9999, y: -9999, activo: false };

    function sembrar() {
      // Densidad proporcional al área, con tope para no castigar pantallas
      // grandes ni portátiles modestos.
      const cuantas = Math.min(Math.round((ancho * alto) / 17000), 95);
      particulas = Array.from({ length: cuantas }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.5 + 0.7,
      }));
    }

    function dimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = lienzo.clientWidth;
      alto = lienzo.clientHeight;
      lienzo.width = Math.round(ancho * dpr);
      lienzo.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sembrar();
      if (reducido) pintar();
    }

    function pintar() {
      ctx.clearRect(0, 0, ancho, alto);

      // --- Líneas entre partículas cercanas ---
      for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
          const a = particulas[i];
          const b = particulas[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > ENLACE * ENLACE) continue;

          const alfa = (1 - Math.sqrt(d2) / ENLACE) * 0.2;
          ctx.strokeStyle = `rgba(61, 122, 224, ${alfa})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // --- Partículas ---
      for (const p of particulas) {
        const dx = p.x - raton.x;
        const dy = p.y - raton.y;
        const dist = Math.hypot(dx, dy);
        const cerca = raton.activo && dist < IMAN;

        if (cerca) {
          // Hilo del cursor a la partícula
          const alfa = (1 - dist / IMAN) * 0.35;
          ctx.strokeStyle = `rgba(255, 159, 0, ${alfa})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(raton.x, raton.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        const brillo = cerca ? 1 - dist / IMAN : 0;
        ctx.fillStyle = cerca
          ? `rgba(255, 159, 0, ${0.25 + brillo * 0.55})`
          : "rgba(156, 196, 250, 0.34)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + brillo * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function avanzar() {
      for (const p of particulas) {
        p.x += p.vx;
        p.y += p.vy;

        // El cursor las aparta con suavidad
        if (raton.activo) {
          const dx = p.x - raton.x;
          const dy = p.y - raton.y;
          const dist = Math.hypot(dx, dy);
          if (dist < IMAN && dist > 0.5) {
            const empuje = (1 - dist / IMAN) * 0.5;
            p.x += (dx / dist) * empuje;
            p.y += (dy / dist) * empuje;
          }
        }

        // Bordes envolventes: el campo nunca se vacía por una esquina
        if (p.x < -20) p.x = ancho + 20;
        else if (p.x > ancho + 20) p.x = -20;
        if (p.y < -20) p.y = alto + 20;
        else if (p.y > alto + 20) p.y = -20;
      }
    }

    function bucle() {
      if (!vivo) return;
      avanzar();
      pintar();
      cuadro = requestAnimationFrame(bucle);
    }

    function alMover(e) {
      raton.x = e.clientX;
      raton.y = e.clientY;
      raton.activo = true;
    }
    function alSalir() {
      raton.activo = false;
      raton.x = -9999;
      raton.y = -9999;
    }

    // Con la pestaña en segundo plano no tiene sentido seguir pintando
    function alCambiarVisibilidad() {
      if (document.hidden) {
        vivo = false;
        if (cuadro) cancelAnimationFrame(cuadro);
      } else if (!reducido) {
        vivo = true;
        bucle();
      }
    }

    dimensionar();
    window.addEventListener("resize", dimensionar);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);

    if (!reducido) {
      window.addEventListener("pointermove", alMover, { passive: true });
      window.addEventListener("pointerleave", alSalir);
      bucle();
    }

    return () => {
      vivo = false;
      if (cuadro) cancelAnimationFrame(cuadro);
      window.removeEventListener("resize", dimensionar);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerleave", alSalir);
    };
  }, []);

  return (
    <canvas
      ref={lienzoRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
