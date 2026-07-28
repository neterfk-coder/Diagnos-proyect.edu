"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CambioAcceso from "@/components/acceso/CambioAcceso";
import CampoFlotante from "@/components/acceso/CampoFlotante";
import BotonEnvio from "@/components/acceso/BotonEnvio";
import BotonInvitado from "@/components/acceso/BotonInvitado";
import Casilla from "@/components/acceso/Casilla";
import FuerzaClave, { evaluarClave } from "@/components/acceso/FuerzaClave";
import { guardarSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Registro() {
  const router = useRouter();
  const { t } = useIdioma();
  const ROLES = t.acceso.roles;

  const [rol, setRol] = useState("estudiante");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("reposo");

  function validar() {
    const e = {};
    if (!nombre.trim()) e.nombre = t.acceso.faltaNombre;
    if (!correo.trim()) e.correo = t.acceso.faltaCorreo;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      e.correo = t.acceso.correoInvalido;
    if (!clave) e.clave = t.acceso.eligeClave;
    else if (clave.length < 8) e.clave = t.acceso.claveCorta;
    else if (evaluarClave(clave) < 2) e.clave = t.acceso.claveDebil;
    if (!acepta) e.acepta = t.acceso.faltaCondiciones;
    return e;
  }

  async function enviar(evento) {
    evento.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    setEstado("cargando");
    // Sin base de datos todavía: simulamos la latencia de la petición real.
    await new Promise((r) => setTimeout(r, 1500));
    guardarSesion({ nombre: nombre.trim(), correo, rol, invitado: false });
    setEstado("listo");
    setTimeout(() => router.push(rol === "docente" ? "/docente" : "/analizar"), 850);
  }

  const indiceRol = ROLES.findIndex((r) => r.id === rol);

  return (
    <div className="animate-aparecer">
      <Link href="/" className="mb-9 inline-flex items-baseline gap-2 lg:hidden">
        <span className="titulo text-2xl font-semibold text-tinta">Diagnos</span>
        <span className="etiqueta">{t.nav.lema}</span>
      </Link>

      <CambioAcceso />

      <header className="mt-8">
        <h1 className="titulo text-4xl font-semibold leading-tight text-tinta">
          {t.acceso.registroTitulo}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-acero">
          {t.acceso.registroEntrada}
        </p>
      </header>

      {/* Selector de rol */}
      <div className="mt-7 animate-aparecer" style={{ animationDelay: "40ms" }}>
        <p className="etiqueta mb-2">{t.acceso.quienEres}</p>
        <div className="relative grid grid-cols-2 gap-2 rounded-2xl border border-hielo bg-nube p-1.5">
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.75rem)] rounded-xl bg-papel shadow-suave transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(calc(${indiceRol * 100}% + ${indiceRol * 0.5}rem))`,
            }}
          />
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRol(r.id)}
              aria-pressed={rol === r.id}
              className="relative z-10 rounded-xl px-3 py-2.5 text-left transition-colors duration-300"
            >
              <span
                className={`block text-sm transition-colors ${
                  rol === r.id ? "font-medium text-tinta" : "text-acero"
                }`}
              >
                {r.texto}
              </span>
              <span
                className={`mt-0.5 block text-[11px] leading-tight transition-colors ${
                  rol === r.id ? "text-cobalto" : "text-acero/70"
                }`}
              >
                {r.pie}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={enviar} noValidate className="mt-6">
        <CampoFlotante
          id="nombre"
          etiqueta={t.acceso.nombre}
          valor={nombre}
          onChange={(v) => {
            setNombre(v);
            if (errores.nombre) setErrores((e) => ({ ...e, nombre: null }));
          }}
          error={errores.nombre}
          autoComplete="name"
          retraso={80}
        />

        <CampoFlotante
          id="correo"
          etiqueta={t.acceso.correo}
          tipo="email"
          valor={correo}
          onChange={(v) => {
            setCorreo(v);
            if (errores.correo) setErrores((e) => ({ ...e, correo: null }));
          }}
          error={errores.correo}
          autoComplete="email"
          retraso={150}
        />

        <div className="animate-aparecer" style={{ animationDelay: "220ms" }}>
          <CampoFlotante
            id="clave"
            etiqueta={t.acceso.contrasena}
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

        <div className="mb-6 mt-2 animate-aparecer" style={{ animationDelay: "300ms" }}>
          <Casilla
            id="acepta"
            marcada={acepta}
            onChange={(v) => {
              setAcepta(v);
              if (errores.acepta) setErrores((e) => ({ ...e, acepta: null }));
            }}
          >
            {t.acceso.condiciones}
          </Casilla>
          {errores.acepta && (
            <p role="alert" className="mt-1.5 animate-aparecer pl-7 text-xs text-ambar">
              {errores.acepta}
            </p>
          )}
        </div>

        <div className="animate-aparecer" style={{ animationDelay: "360ms" }}>
          <BotonEnvio
            acento
            estado={estado}
            textoCargando={t.acceso.registroCargando}
            textoListo={t.acceso.registroListo}
          >
            {t.acceso.registroBoton}
          </BotonEnvio>
        </div>
      </form>

      <div
        className="my-6 flex animate-aparecer items-center gap-4 text-[11px] uppercase tracking-etiqueta text-acero"
        style={{ animationDelay: "420ms" }}
      >
        <span className="h-px flex-1 bg-hielo" />
        {t.acceso.separadorRegistro}
        <span className="h-px flex-1 bg-hielo" />
      </div>

      <div className="animate-aparecer" style={{ animationDelay: "480ms" }}>
        <BotonInvitado />
      </div>

      <p
        className="mt-9 animate-aparecer text-center text-sm text-acero"
        style={{ animationDelay: "540ms" }}
      >
        {t.acceso.yaTienes}{" "}
        <Link
          href="/entrar"
          className="font-medium text-cobalto hover:underline hover:underline-offset-4"
        >
          {t.acceso.iniciaSesion}
        </Link>
      </p>
    </div>
  );
}
