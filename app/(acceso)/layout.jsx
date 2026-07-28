import PanelMarca from "@/components/acceso/PanelMarca";
import SelectorIdioma from "@/components/SelectorIdioma";

export const metadata = {
  title: "Sign in — Diagnos",
};

/**
 * Cáscara de dos columnas para las pantallas de acceso.
 * Izquierda: panel de marca animado (oculto en móvil).
 * Derecha: el formulario, siempre centrado.
 */
export default function LayoutAcceso({ children }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <PanelMarca />

      {/* Aquí no hay Nav, así que el selector de idioma va flotando */}
      <div className="absolute right-5 top-5 z-20 sm:right-7 sm:top-7">
        <SelectorIdioma />
      </div>

      <section className="relative flex items-center justify-center overflow-hidden px-6 py-14 sm:px-10">
        {/* Halo de color muy tenue, solo en móvil, para que no quede plano */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "radial-gradient(40rem 20rem at 50% -15%, rgba(31,74,168,0.10), transparent 65%)",
          }}
        />
        <div className="relative w-full max-w-[26rem]">{children}</div>
      </section>
    </div>
  );
}
