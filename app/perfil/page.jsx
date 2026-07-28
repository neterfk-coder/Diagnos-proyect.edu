"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CabeceraPagina from "@/components/CabeceraPagina";
import SelectorIdioma from "@/components/SelectorIdioma";
import { leerSesion, cerrarSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Perfil() {
  const router = useRouter();
  const { t } = useIdioma();
  const p = t.paginas.perfil;

  const [sesion, setSesion] = useState(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setSesion(leerSesion());
    setCargado(true);
  }, []);

  function salir() {
    cerrarSesion();
    setSesion(null);
    router.push("/");
  }

  const inicial = (sesion?.nombre || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <CabeceraPagina etiqueta={p.etiqueta} titulo={p.titulo} />

      {!cargado ? (
        <div className="mt-12 h-40 animate-pulse rounded-2xl bg-hielo/40" />
      ) : !sesion ? (
        /* ---------- Sin sesión ---------- */
        <div className="tarjeta mt-12 animate-aparecer p-8 text-center sm:p-10">
          <h2 className="titulo text-2xl font-semibold">{p.sinSesionTitulo}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-acero">
            {p.sinSesionTexto}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/entrar" className="boton-primario">
              {p.entrar}
            </Link>
            <Link href="/registro" className="boton-secundario">
              {p.registro}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 space-y-6">
          {/* ---------- Identidad ---------- */}
          <div className="tarjeta animate-aparecer p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-5">
              <span
                translate="no"
                className={`notranslate grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-medium ${
                  sesion.invitado
                    ? "border border-hielo bg-nube text-acero"
                    : "bg-electrico text-abismo shadow-azul"
                }`}
              >
                {sesion.invitado ? "★" : inicial}
              </span>
              <div className="min-w-0">
                <h2 className="titulo truncate text-2xl font-semibold">
                  {sesion.invitado ? p.invitadoTitulo : sesion.nombre}
                </h2>
                <p className="mt-1 text-sm text-acero">
                  {sesion.invitado
                    ? p.invitadoTexto
                    : t.nav.roles[sesion.rol] || sesion.rol}
                </p>
              </div>
            </div>

            {!sesion.invitado && (
              <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-hielo pt-6 sm:grid-cols-2">
                <div>
                  <dt className="etiqueta">{p.campos.nombre}</dt>
                  <dd className="mt-1 truncate text-sm text-tinta">{sesion.nombre}</dd>
                </div>
                <div>
                  <dt className="etiqueta">{p.campos.correo}</dt>
                  <dd className="mt-1 truncate text-sm text-tinta">
                    {sesion.correo || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="etiqueta">{p.campos.rol}</dt>
                  <dd className="mt-1 text-sm text-tinta">
                    {t.nav.roles[sesion.rol] || sesion.rol}
                  </dd>
                </div>
              </dl>
            )}

            {sesion.invitado && (
              <Link href="/registro" className="boton-acento mt-7">
                {p.registro}
              </Link>
            )}
          </div>

          {/* ---------- Preferencias ---------- */}
          <div
            className="tarjeta animate-aparecer p-6 sm:p-8"
            style={{ animationDelay: "90ms" }}
          >
            <h3 className="titulo text-xl font-semibold">{p.preferencias}</h3>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-acero">{p.campos.idioma}</p>
              <SelectorIdioma />
            </div>
          </div>

          {/* ---------- Datos y salida ---------- */}
          <div
            className="tarjeta animate-aparecer p-6 sm:p-8"
            style={{ animationDelay: "180ms" }}
          >
            <h3 className="titulo text-xl font-semibold">{p.datos}</h3>
            <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-acero">
              {p.datosTexto}
            </p>
            <button type="button" onClick={salir} className="boton-secundario mt-6">
              {sesion.invitado ? t.nav.salirInvitado : p.salir}
            </button>
          </div>

          <p className="px-1 text-xs leading-relaxed text-acero/80">{p.aviso}</p>
        </div>
      )}
    </div>
  );
}
