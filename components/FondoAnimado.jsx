"use client";

import { usePathname } from "next/navigation";
import CampoParticulas from "@/components/CampoParticulas";

/** Las pantallas de acceso traen su propio fondo. */
const RUTAS_ACCESO = ["/entrar", "/registro", "/recuperar"];

/**
 * Glifos de álgebra que suben despacio por el fondo.
 * Las posiciones son fijas a propósito: con valores aleatorios el HTML del
 * servidor y el del cliente no coincidirían y React se quejaría al hidratar.
 */
const GLIFOS = [
  { s: "x", izq: "7%", tam: "3.4rem", dur: 19, esp: 0 },
  { s: "=", izq: "18%", tam: "2.6rem", dur: 23, esp: -6 },
  { s: "+", izq: "29%", tam: "2.2rem", dur: 17, esp: -11 },
  { s: "√", izq: "41%", tam: "3rem", dur: 25, esp: -3 },
  { s: "−", izq: "53%", tam: "2.4rem", dur: 21, esp: -14 },
  { s: "x²", izq: "64%", tam: "2.8rem", dur: 27, esp: -8 },
  { s: "π", izq: "75%", tam: "2.5rem", dur: 20, esp: -17 },
  { s: "÷", izq: "85%", tam: "2.2rem", dur: 24, esp: -2 },
  { s: "≠", izq: "93%", tam: "2.6rem", dur: 18, esp: -12 },
];

export default function FondoAnimado() {
  const ruta = usePathname();
  if (RUTAS_ACCESO.includes(ruta)) return null;

  return (
    <div
      aria-hidden="true"
      // translate="no" es imprescindible aquí: el traductor automático del
      // navegador convertía la «x» suelta en «incógnita» antes de que React
      // hidratara, y eso rompía la hidratación. Son símbolos, no idioma.
      translate="no"
      className="notranslate pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Orbes de luz en deriva lenta */}
      <span className="orbe animate-derivar -left-40 -top-40 h-[38rem] w-[38rem] bg-electrico/20" />
      <span
        className="orbe animate-derivar right-[-14rem] top-[14%] h-[34rem] w-[34rem] bg-cobalto/[0.14]"
        style={{ animationDelay: "-9s" }}
      />
      <span
        className="orbe animate-derivar bottom-[-12rem] left-[18%] h-[32rem] w-[32rem] bg-marino/35"
        style={{ animationDelay: "-17s" }}
      />
      <span
        className="orbe animate-respirar left-[52%] top-[42%] h-[22rem] w-[22rem] bg-celeste/[0.10]"
        style={{ animationDelay: "-4s" }}
      />

      {/* Constelación de partículas que reacciona al cursor */}
      <CampoParticulas />

      {/* Glifos matemáticos ascendiendo */}
      {GLIFOS.map((g) => (
        <span
          key={g.s + g.izq}
          translate="no"
          className="notranslate titulo absolute bottom-[-4rem] animate-flotar-glifo select-none font-semibold text-celeste/[0.09]"
          style={{
            left: g.izq,
            fontSize: g.tam,
            animationDuration: `${g.dur}s`,
            animationDelay: `${g.esp}s`,
          }}
        >
          {g.s}
        </span>
      ))}

      {/* Retícula: da sensación de plano técnico, no de fondo vacío */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(156,196,250,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(156,196,250,.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 85% 65% at 50% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 65% at 50% 0%, #000 35%, transparent 100%)",
        }}
      />
    </div>
  );
}
