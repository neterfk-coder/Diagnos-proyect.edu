"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";
import SelectorIdioma from "@/components/SelectorIdioma";

/** Rutas que traen su propia cáscara a pantalla completa. */
const RUTAS_ACCESO = ["/entrar", "/registro", "/recuperar"];

export default function Nav() {
  const ruta = usePathname();
  const router = useRouter();
  const { t } = useIdioma();
  const enlaces = [
    { href: "/analizar", texto: t.nav.analizar },
    { href: "/tutor", texto: t.nav.tutor },
    { href: "/docente", texto: t.nav.docente },
  ];
  const { sesion, cargando, salir: cerrarSesion } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // El menú se cierra al navegar; si no, queda abierto sobre la página nueva
  useEffect(() => setMenuAbierto(false), [ruta]);

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
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                ruta === e.href
                  ? "bg-nube font-medium text-cobalto"
                  : "text-acero hover:text-tinta"
              }`}
            >
              {e.texto}
            </Link>
          ))}

          <span className="mx-1 hidden h-5 w-px bg-hielo sm:block" />

          <SelectorIdioma />

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
