"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";
import SelectorIdioma from "@/components/SelectorIdioma";
import BarraProgreso from "@/components/progreso/BarraProgreso";
import Racha from "@/components/progreso/Racha";

/** Rutas que traen su propia cáscara a pantalla completa. */
const RUTAS_ACCESO = ["/entrar", "/registro", "/recuperar"];

export default function Nav() {
  const ruta = usePathname();
  const router = useRouter();
  const { t } = useIdioma();
  const enlaces = [
    { href: "/analizar", texto: t.nav.analizar },
    { href: "/grafica", texto: t.nav.grafica },
    { href: "/tutor", texto: t.nav.tutor },
    { href: "/docente", texto: t.nav.docente },
  ];
  const { sesion, cargando, salir: cerrarSesion } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);

  // El menú se cierra al navegar; si no, queda abierto sobre la página nueva
  useEffect(() => {
    setMenuAbierto(false);
    setMenuMovil(false);
  }, [ruta]);

  if (RUTAS_ACCESO.includes(ruta)) return null;

  async function salir() {
    setMenuAbierto(false);
    await cerrarSesion();
    router.push("/");
  }

  const inicial = (sesion?.nombre || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-hielo/70 bg-abismo/70 shadow-[0_1px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="titulo text-2xl font-semibold text-white">Diagnos</span>
          <span className="hidden text-[11px] uppercase tracking-etiqueta text-acero sm:inline">
            {t.nav.lema}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {/* En móvil los enlaces se pliegan en un menú: cuatro etiquetas de
              texto más los tres indicadores no caben en 375 px y desbordaban
              la barra. */}
          <div className="hidden items-center gap-1 lg:flex">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  ruta === e.href
                    ? "bg-ambar/15 font-medium text-ambar"
                    : "text-acero hover:text-tinta"
                }`}
              >
                {e.texto}
              </Link>
            ))}
          </div>

          <div className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setMenuMovil((m) => !m)}
              aria-expanded={menuMovil}
              aria-label={t.nav.menu}
              className="grid h-9 w-9 place-items-center rounded-full border border-hielo bg-nube text-acero transition-colors hover:border-cobalto/60 hover:text-tinta"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuMovil ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>

            {menuMovil && (
              <>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setMenuMovil(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="tarjeta absolute left-0 z-20 mt-2 w-56 animate-aparecer overflow-hidden !shadow-tarjeta">
                  {enlaces.map((e) => (
                    <Link
                      key={e.href}
                      href={e.href}
                      onClick={() => setMenuMovil(false)}
                      className={`block px-4 py-3 text-sm transition-colors hover:bg-nube ${
                        ruta === e.href ? "font-medium text-ambar" : "text-tinta"
                      }`}
                    >
                      {e.texto}
                    </Link>
                  ))}
                  <div className="flex items-center justify-between gap-3 border-t border-hielo px-4 py-3">
                    <span className="etiqueta">{t.nav.idioma}</span>
                    <SelectorIdioma />
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="mx-1 hidden h-5 w-px bg-hielo sm:block" />

          <Racha />

          <BarraProgreso />

          <span className="mx-1 hidden h-5 w-px bg-hielo lg:block" />

          <div className="hidden lg:block">
            <SelectorIdioma />
          </div>

          <span className="mx-1 hidden h-5 w-px bg-hielo sm:block" />

          {cargando ? (
            // Espacio reservado mientras se comprueba la sesión: evita que el
            // botón "Entrar" parpadee antes de saber si hay usuario.
            <span
              aria-hidden="true"
              className="h-8 w-20 animate-pulse rounded-full bg-hielo/50"
            />
          ) : sesion ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuAbierto((a) => !a)}
                aria-expanded={menuAbierto}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-nube"
              >
                <span
                  translate="no"
                  className={`notranslate grid h-8 w-8 place-items-center rounded-full text-xs font-medium ${
                    sesion.invitado
                      ? "border border-hielo bg-nube text-acero"
                      : "bg-electrico text-abismo"
                  }`}
                >
                  {sesion.invitado ? "★" : inicial}
                </span>
                <span className="hidden max-w-[9rem] truncate text-sm text-tinta sm:inline">
                  {sesion.invitado ? t.nav.invitado : sesion.nombre}
                </span>
              </button>

              {menuAbierto && (
                <>
                  <button
                    type="button"
                    aria-label="Cerrar menú"
                    onClick={() => setMenuAbierto(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />
                  <div
                    role="menu"
                    className="tarjeta absolute right-0 z-20 mt-2 w-56 animate-aparecer overflow-hidden !shadow-tarjeta"
                  >
                    <div className="border-b border-hielo bg-nube px-4 py-3">
                      <p className="etiqueta">
                        {sesion.invitado
                          ? t.nav.modoInvitado
                          : t.nav.roles[sesion.rol] || sesion.rol}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-medium text-tinta">
                        {sesion.invitado ? t.nav.sinHistorial : sesion.correo}
                      </p>
                    </div>
                    {sesion.invitado ? (
                      <Link
                        href="/registro"
                        onClick={() => setMenuAbierto(false)}
                        className="block px-4 py-3 text-sm text-cobalto transition-colors hover:bg-nube"
                      >
                        {t.nav.crearCuenta}
                      </Link>
                    ) : (
                      <Link
                        href="/perfil"
                        onClick={() => setMenuAbierto(false)}
                        className="block px-4 py-3 text-sm text-tinta transition-colors hover:bg-nube"
                      >
                        {t.paginas.perfil.etiqueta}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={salir}
                      className="block w-full px-4 py-3 text-left text-sm text-acero transition-colors hover:bg-nube hover:text-tinta"
                    >
                      {sesion.invitado ? t.nav.salirInvitado : t.nav.cerrarSesion}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/entrar"
              className="rounded-full bg-electrico px-5 py-2 text-sm font-medium text-abismo shadow-azul transition-all hover:-translate-y-0.5 hover:bg-celeste"
            >
              {t.nav.entrar}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
