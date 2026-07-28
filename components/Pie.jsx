"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIdioma } from "@/lib/i18n/contexto";
import SelectorIdioma from "@/components/SelectorIdioma";

/** Rutas que traen su propia cáscara a pantalla completa. */
const RUTAS_ACCESO = ["/entrar", "/registro", "/recuperar"];

/** Columna de enlaces con desplazamiento sutil al pasar el ratón. */
function Columna({ titulo, enlaces }) {
  return (
    <nav aria-label={titulo}>
      <h3 className="etiqueta">{titulo}</h3>
      <ul className="mt-4 space-y-2.5">
        {enlaces.map((e) => (
          <li key={e.href + e.texto}>
            <Link
              href={e.href}
              className="group inline-flex items-center gap-1.5 text-sm text-acero transition-colors duration-200 hover:text-cobalto"
            >
              <span className="h-px w-0 bg-cobalto transition-all duration-300 group-hover:w-3" />
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                {e.texto}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Pie() {
  const ruta = usePathname();
  const { t } = useIdioma();
  if (RUTAS_ACCESO.includes(ruta)) return null;

  const anio = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-hielo/70 bg-profundo/50 backdrop-blur-xl">
      {/* Filo de color: separa el pie del contenido sin una línea dura */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cobalto/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* ---------- Marca ---------- */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-flex items-baseline gap-2">
              <span className="titulo text-2xl font-semibold text-white">Diagnos</span>
              <span className="etiqueta">{t.nav.lema}</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-acero">
              {t.pie.descripcion}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <SelectorIdioma />
              <span className="inline-flex items-center gap-2 rounded-full border border-hielo bg-nube px-3 py-1.5 text-[11px] font-medium text-acero">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalto opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalto" />
                </span>
                {t.pie.estado}
              </span>
            </div>
          </div>

          {/* ---------- Columnas de enlaces ---------- */}
          <Columna titulo={t.pie.producto.titulo} enlaces={t.pie.producto.enlaces} />
          <Columna titulo={t.pie.cuenta.titulo} enlaces={t.pie.cuenta.enlaces} />
          <Columna titulo={t.pie.soporte.titulo} enlaces={t.pie.soporte.enlaces} />
          <Columna titulo={t.pie.legal.titulo} enlaces={t.pie.legal.enlaces} />
        </div>
      </div>

      {/* ---------- Barra inferior ---------- */}
      <div className="border-t border-hielo/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-acero">
            © {anio} Diagnos. {t.pie.derechos}
            <span className="mx-2 hidden text-hielo sm:inline">·</span>
            <span className="block sm:inline">{t.pie.evento}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {t.pie.barraLegal.map((e) => (
              <Link
                key={e.href + e.texto}
                href={e.href}
                className="text-xs text-acero underline decoration-hielo underline-offset-4 transition-colors hover:text-cobalto hover:decoration-cobalto"
              >
                {e.texto}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="pb-6 text-center text-[11px] text-acero/70">{t.pie.hecho}</p>
    </footer>
  );
}
