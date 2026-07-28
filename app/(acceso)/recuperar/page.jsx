"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CampoFlotante from "@/components/acceso/CampoFlotante";
import BotonEnvio from "@/components/acceso/BotonEnvio";
import AvisoAcceso from "@/components/acceso/AvisoAcceso";
import FuerzaClave, { evaluarClave } from "@/components/acceso/FuerzaClave";
import {
  pedirRecuperacion,
  completarRecuperacion,
  claveDeError,
  hayCuentas,
} from "@/lib/cuenta";
import { useIdioma } from "@/lib/i18n/contexto";

function Marca() {
  const { t } = useIdioma();
  return (
    <Link href="/" className="mb-9 inline-flex items-baseline gap-2 lg:hidden">
      <span className="titulo text-2xl font-semibold text-white">Diagnos</span>
      <span className="etiqueta">{t.nav.lema}</span>
    </Link>
  );
}

function VolverAEntrar() {
  const { t } = useIdioma();
  return (
    <Link
      href="/entrar"
      className="group inline-flex items-center gap-2 text-sm text-acero transition-colors hover:text-cobalto"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-x-1"
      >
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      {t.acceso.volver}
    </Link>
  );
}

/* ================= Pedir el enlace ================= */
function PedirEnlace() {
  const { t } = useIdioma();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [estado, setEstado] = useState("reposo");
  const [enviado, setEnviado] = useState(false);
  const [cuenta, setCuenta] = useState(0);

  useEffect(() => {
    if (cuenta <= 0) return;
    const reloj = setTimeout(() => setCuenta((c) => c - 1), 1000);
    return () => clearTimeout(reloj);
  }, [cuenta]);

  async function enviar(evento) {
    evento.preventDefault();
    setAviso(null);
    if (!correo.trim()) return setError(t.acceso.faltaCorreo);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      return setError(t.acceso.correoInvalido);
    setError(null);

    if (!hayCuentas()) return setAviso(t.acceso.errores.sinCuentas);

    setEstado("cargando");
    try {
      // Appwrite añade userId y secret a esta URL al enviar el correo
      await pedirRecuperacion(correo.trim(), `${window.location.origin}/recuperar`);
      setEstado("listo");
      setTimeout(() => {
        setEnviado(true);
        setCuenta(30);
      }, 700);
    } catch (e) {
      setEstado("reposo");
      setAviso(t.acceso.errores[claveDeError(e)] || t.acceso.errores.generico);
    }
  }

  async function reenviar() {
    setCuenta(30);
    try {
      await pedirRecuperacion(correo.trim(), `${window.location.origin}/recuperar`);
    } catch {
      /* el aviso de cuenta atrás ya evita el abuso */
    }
  }

  if (enviado) {
    return (
      <div className="mt-8 animate-aparecer text-center">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulso rounded-full bg-cobalto/10"
          />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-electrico text-abismo shadow-azul">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
              <path
                d="m3.5 7 8.5 6 8.5-6"
                className="animate-dibujar-trazo"
                style={{ strokeDasharray: 32 }}
              />
            </svg>
          </span>
        </div>

        <h1 className="titulo mt-6 text-3xl font-semibold leading-tight text-white">
          {t.acceso.enviadoTitulo}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-acero">
          {t.acceso.enviadoTexto1}{" "}
          <span className="font-medium text-tinta">{correo}</span>
          {t.acceso.enviadoTexto2}
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/entrar" className="boton-primario w-full !py-3.5">
            {t.acceso.volverEntrar}
          </Link>
          <button
            type="button"
            onClick={reenviar}
            disabled={cuenta > 0}
            className="w-full text-sm text-acero transition-colors hover:text-cobalto disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cuenta > 0 ? `${t.acceso.reenviarEn} ${cuenta}s` : t.acceso.reenviar}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="mt-8">
        <h1 className="titulo text-4xl font-semibold leading-tight text-white">
          {t.acceso.recuperarTitulo}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-acero">
          {t.acceso.recuperarEntrada}
        </p>
      </header>

      <form onSubmit={enviar} noValidate className="mt-7">
        <CampoFlotante
          id="correo"
          etiqueta={t.acceso.correo}
          tipo="email"
          valor={correo}
          onChange={(v) => {
            setCorreo(v);
            if (error) setError(null);
          }}
          error={error}
          autoComplete="email"
          retraso={60}
        />

        <AvisoAcceso mensaje={aviso} />

        <div className="animate-aparecer" style={{ animationDelay: "140ms" }}>
          <BotonEnvio
            estado={estado}
            textoCargando={t.acceso.recuperarCargando}
            textoListo={t.acceso.recuperarListo}
          >
            {t.acceso.recuperarBoton}
          </BotonEnvio>
        </div>
      </form>

      <p
        className="mt-6 animate-aparecer text-center text-xs leading-relaxed text-acero"
        style={{ animationDelay: "200ms" }}
      >
        {t.acceso.recuperarNota}
      </p>
    </>
  );
}

/* ================= Fijar la nueva contraseña ================= */
function NuevaClave({ userId, secret }) {
  const { t } = useIdioma();
  const [clave, setClave] = useState("");
  const [repetida, setRepetida] = useState("");
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [estado, setEstado] = useState("reposo");
  const [hecho, setHecho] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setAviso(null);

    const e = {};
    if (!clave) e.clave = t.acceso.eligeClave;
    else if (clave.length < 8) e.clave = t.acceso.claveCorta;
    else if (evaluarClave(clave) < 2) e.clave = t.acceso.claveDebil;
    if (repetida !== clave) e.repetida = t.acceso.noCoinciden;
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    setEstado("cargando");
    try {
      await completarRecuperacion(userId, secret, clave);
      setEstado("listo");
      setTimeout(() => setHecho(true), 700);
    } catch (error) {
      setEstado("reposo");
      setAviso(t.acceso.errores[claveDeError(error)] || t.acceso.errores.generico);
    }
  }

  if (hecho) {
    return (
      <div className="mt-8 animate-aparecer text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-electrico text-abismo shadow-azul">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="m4 12.5 5.2 5.2L20 7"
              className="animate-dibujar-trazo"
              style={{ strokeDasharray: 32 }}
            />
          </svg>
        </span>
        <h1 className="titulo mt-6 text-3xl font-semibold leading-tight text-white">
          {t.acceso.listoTitulo}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-acero">
          {t.acceso.listoTexto}
        </p>
        <Link href="/entrar" className="boton-acento mt-8 w-full !py-3.5">
          {t.acceso.iniciarSesion}
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="mt-8">
        <h1 className="titulo text-4xl font-semibold leading-tight text-white">
          {t.acceso.nuevaTitulo}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-acero">
          {t.acceso.nuevaEntrada}
        </p>
      </header>

      <form onSubmit={enviar} noValidate className="mt-7">
        <div className="animate-aparecer" style={{ animationDelay: "60ms" }}>
          <CampoFlotante
            id="clave"
            etiqueta={t.acceso.nuevaClave}
            tipo="password"
            valor={clave}
            onChange={(v) => {
              setClave(v);
              if (errores.clave) setErrores((e) => ({ ...e, clave: null }));
            }}
            error={errores.clave}
            autoComplete="new-password"
          />
          <FuerzaClave clave={clave} />
        </div>

        <div className="mt-2">
          <CampoFlotante
            id="repetida"
            etiqueta={t.acceso.repetirClave}
            tipo="password"
            valor={repetida}
            onChange={(v) => {
              setRepetida(v);
              if (errores.repetida) setErrores((e) => ({ ...e, repetida: null }));
            }}
            error={errores.repetida}
            autoComplete="new-password"
            retraso={140}
          />
        </div>

        <AvisoAcceso mensaje={aviso} />

        <BotonEnvio
          acento
          estado={estado}
          textoCargando={t.acceso.guardandoClave}
          textoListo={t.acceso.claveGuardada}
        >
          {t.acceso.guardarClave}
        </BotonEnvio>
      </form>
    </>
  );
}

function Contenido() {
  const parametros = useSearchParams();
  const userId = parametros.get("userId");
  const secret = parametros.get("secret");
  const recuperando = Boolean(userId && secret);

  return (
    <div className="animate-aparecer">
      <Marca />
      {!recuperando && <VolverAEntrar />}
      {recuperando ? (
        <NuevaClave userId={userId} secret={secret} />
      ) : (
        <PedirEnlace />
      )}
    </div>
  );
}

export default function Recuperar() {
  // useSearchParams obliga a una frontera de Suspense para poder
  // pre-renderizar la página en la compilación.
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-hielo/30" />}>
      <Contenido />
    </Suspense>
  );
}
