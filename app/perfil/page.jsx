"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CabeceraPagina from "@/components/CabeceraPagina";
import SelectorIdioma from "@/components/SelectorIdioma";
import { useSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";

/**
 * Aula y tipo de cuenta.
 * El docente ve su código para repartirlo; el estudiante escribe el que le
 * dieron. Las dos cosas viven en las preferencias de la cuenta de Appwrite.
 */
function SeccionAula({ sesion }) {
  const { t } = useIdioma();
  const { actualizarPerfil } = useSesion();
  const p = t.paginas.perfil;

  const esDocente = sesion.rol === "docente";
  const [codigo, setCodigo] = useState(sesion.aula || "");
  const [estado, setEstado] = useState("reposo");
  const [copiado, setCopiado] = useState(false);

  async function guardar(rol, aula) {
    setEstado("guardando");
    try {
      await actualizarPerfil({ rol, aula });
      setEstado("guardado");
      setTimeout(() => setEstado("reposo"), 2000);
    } catch {
      setEstado("reposo");
    }
  }

  function copiar() {
    navigator.clipboard?.writeText(sesion.aula || "");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <>
      {/* Tipo de cuenta */}
      <div
        className="tarjeta animate-aparecer p-6 sm:p-8"
        style={{ animationDelay: "60ms" }}
      >
        <h3 className="titulo text-xl font-semibold text-white">{p.rolTitulo}</h3>
        <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-acero">
          {p.rolTexto}
        </p>

        <div className="relative mt-5 grid max-w-sm grid-cols-2 gap-2 rounded-2xl border border-hielo bg-nube p-1.5">
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.75rem)] rounded-xl bg-papel shadow-suave transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(calc(${esDocente ? 1 : 0} * (100% + 0.5rem)))`,
            }}
          />
          {["estudiante", "docente"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => guardar(r, r === "docente" ? null : codigo)}
              aria-pressed={sesion.rol === r}
              className={`relative z-10 rounded-xl px-3 py-2.5 text-sm transition-colors duration-300 ${
                sesion.rol === r ? "font-medium text-tinta" : "text-acero"
              }`}
            >
              {t.nav.roles[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Aula */}
      <div
        className="tarjeta animate-aparecer p-6 sm:p-8"
        style={{ animationDelay: "120ms" }}
      >
        <h3 className="titulo text-xl font-semibold text-white">{p.aulaTitulo}</h3>
        <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-acero">
          {esDocente ? p.aulaDocenteTexto : p.aulaEstudianteTexto}
        </p>

        {esDocente ? (
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span
              translate="no"
              className="notranslate titulo text-3xl font-semibold tracking-[0.2em] text-ambar"
            >
              {sesion.aula}
            </span>
            <button
              type="button"
              onClick={copiar}
              className="boton-secundario !px-5 !py-2 text-xs"
            >
              {copiado ? t.docente.copiado : t.docente.copiar}
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="min-w-[12rem] flex-1">
              <label htmlFor="aula" className="etiqueta mb-2 block">
                {p.aulaCampo}
              </label>
              <input
                id="aula"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                maxLength={12}
                placeholder="ABC123"
                translate="no"
                className="notranslate campo font-mono tracking-[0.2em]"
              />
            </div>
            <button
              type="button"
              onClick={() => guardar("estudiante", codigo)}
              disabled={estado === "guardando"}
              className="boton-acento !px-6 !py-3 text-xs"
            >
              {estado === "guardando"
                ? p.aulaGuardando
                : estado === "guardado"
                ? p.aulaGuardada
                : p.aulaGuardar}
            </button>
          </div>
        )}

        {!esDocente && !sesion.aula && (
          <p className="mt-3 text-xs text-acero/80">{p.sinAula}</p>
        )}
      </div>
    </>
  );
}

export default function Perfil() {
  const router = useRouter();
  const { t } = useIdioma();
  const p = t.paginas.perfil;

  const { sesion, cargando, salir: cerrarSesion } = useSesion();
  const cargado = !cargando;

  async function salir() {
    await cerrarSesion();
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

          {/* ---------- Aula y rol ---------- */}
          {!sesion.invitado && <SeccionAula sesion={sesion} />}

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
        </div>
      )}
    </div>
  );
}
