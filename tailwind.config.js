/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // Sistema de color Diagnos — interfaz oscura en azul profundo.
        //
        // Los nombres conservan su ROL, no su tono: "papel" sigue siendo
        // la superficie de las tarjetas y "tinta" el texto principal, solo
        // que ahora papel es azul profundo y tinta es casi blanco. Así toda
        // la interfaz se invierte sin reescribir las clases del JSX.
        // ============================================================
        abismo: "#060D20",    // fondo de página, el más profundo
        profundo: "#0B1836",  // superficies inmersivas
        papel: "#0E1D42",     // superficie de las tarjetas
        nube: "#132449",      // superficies embutidas dentro de una tarjeta
        hielo: "#22366A",     // bordes y divisores

        tinta: "#E9F0FC",     // texto principal (antes era el más oscuro)
        acero: "#93A7CC",     // texto secundario
        bruma: "#A8BCDD",     // texto terciario

        marino: "#16336F",    // azul medio decorativo
        electrico: "#3D7AE0", // fondo de los botones principales
        cobalto: "#5B9BF5",   // acento: enlaces, iconos, bordes activos
        celeste: "#9CC4FA",   // acento brillante y estados hover

        // Naranja: el único acento cálido de la interfaz. Significa
        // "aquí está lo importante", y por eso marca las dos cosas
        // importantes: la acción principal y el paso donde se rompe
        // el razonamiento.
        ambar: "#FF9F00",
        ambarVivo: "#FFB733",   // estado hover
        ambarTenue: "#FFC46B",  // texto largo sobre fondo oscuro

        blancoLuz: "rgba(255,255,255,0.08)", // filos y reflejos de cristal
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        etiqueta: "0.14em",
      },
      boxShadow: {
        // Sombras para interfaz oscura: negro para dar profundidad y un halo
        // azul para la elevación, porque sobre fondo oscuro una sombra sola
        // no se ve — lo que se percibe como relieve es el resplandor.
        suave: "0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.28)",
        tarjeta: "0 2px 6px rgba(0, 0, 0, 0.45), 0 18px 44px rgba(0, 0, 0, 0.38)",
        elevada:
          "0 2px 8px rgba(0, 0, 0, 0.5), 0 28px 64px rgba(61, 122, 224, 0.28)",
        azul: "0 8px 26px rgba(61, 122, 224, 0.32)",
        naranja: "0 8px 26px rgba(255, 159, 0, 0.34)",
        // Filo de luz superior: el reflejo que hace que una superficie
        // oscura parezca cristal en lugar de un rectángulo plano.
        filo: "inset 0 1px 0 rgba(255, 255, 255, 0.10)",
      },
      keyframes: {
        aparecer: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulso: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232, 183, 92, 0.45)" },
          "50%": { boxShadow: "0 0 0 8px rgba(232, 183, 92, 0)" },
        },
        trazar: {
          from: { height: "0%" },
          to: { height: "100%" },
        },
        // --- Pantallas de acceso ---
        aurora: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, -8%, 0) scale(1.15)" },
          "66%": { transform: "translate3d(-5%, 6%, 0) scale(0.92)" },
        },
        entrarIzquierda: {
          from: { opacity: "0", transform: "translateX(-18px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        temblar: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        girar: {
          to: { transform: "rotate(360deg)" },
        },
        dibujarTrazo: {
          from: { strokeDashoffset: "32" },
          to: { strokeDashoffset: "0" },
        },
        brillo: {
          from: { transform: "translateX(-120%)" },
          to: { transform: "translateX(220%)" },
        },
        flotarSuave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        // --- Profundidad e interacción ---
        revelar: {
          from: { opacity: "0", transform: "translateY(26px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        gradienteVivo: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // --- Sistema de recompensas ---
        temblarCofre: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "15%": { transform: "rotate(-9deg) scale(1.04)" },
          "30%": { transform: "rotate(8deg) scale(1.04)" },
          "45%": { transform: "rotate(-7deg) scale(1.06)" },
          "60%": { transform: "rotate(6deg) scale(1.06)" },
          "75%": { transform: "rotate(-4deg) scale(1.08)" },
        },
        estallar: {
          from: { opacity: "1", transform: "translate(0,0) scale(1)" },
          to: { opacity: "0", transform: "translate(var(--dx), var(--dy)) scale(0.2)" },
        },
        revelarPremio: {
          "0%": { opacity: "0", transform: "scale(0.3) rotate(-25deg)" },
          "60%": { opacity: "1", transform: "scale(1.18) rotate(6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        subirGanancia: {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.9)" },
          "20%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "80%": { opacity: "1", transform: "translateY(-6px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-14px) scale(0.95)" },
        },
        latidoCofre: {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.12)", filter: "brightness(1.35)" },
        },
        barrido: {
          from: { transform: "translateX(-120%)" },
          to: { transform: "translateX(320%)" },
        },
        derivar: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "25%": { transform: "translate3d(4%, -6%, 0) scale(1.08)" },
          "50%": { transform: "translate3d(-3%, 5%, 0) scale(0.95)" },
          "75%": { transform: "translate3d(5%, 3%, 0) scale(1.04)" },
        },
        // Glifos matemáticos que suben despacio por el fondo
        flotarGlifo: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "12%, 88%": { opacity: "1" },
          "100%": { transform: "translateY(-140px) rotate(14deg)", opacity: "0" },
        },
        // Halo que gira detrás de las tarjetas destacadas
        orbitar: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        respirar: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.12)" },
        },
      },
      animation: {
        aparecer: "aparecer 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        pulso: "pulso 2.4s ease-in-out infinite",
        trazar: "trazar 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        aurora: "aurora 18s ease-in-out infinite",
        "entrar-izquierda": "entrarIzquierda 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
        temblar: "temblar 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        girar: "girar 0.7s linear infinite",
        "dibujar-trazo": "dibujarTrazo 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.1s both",
        brillo: "brillo 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "flotar-suave": "flotarSuave 7s ease-in-out infinite",
        revelar: "revelar 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "gradiente-vivo": "gradienteVivo 9s ease-in-out infinite",
        derivar: "derivar 26s ease-in-out infinite",
        "temblar-cofre": "temblarCofre 0.6s ease-in-out 2",
        estallar: "estallar 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "revelar-premio": "revelarPremio 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
        "subir-ganancia": "subirGanancia 2.6s ease-out both",
        "latido-cofre": "latidoCofre 1.6s ease-in-out infinite",
        barrido: "barrido 2.2s ease-in-out infinite",
        "flotar-glifo": "flotarGlifo 16s linear infinite",
        orbitar: "orbitar 14s linear infinite",
        respirar: "respirar 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
