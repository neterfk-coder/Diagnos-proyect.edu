"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CambioAcceso from "@/components/acceso/CambioAcceso";
import CampoFlotante from "@/components/acceso/CampoFlotante";
import BotonEnvio from "@/components/acceso/BotonEnvio";
import BotonInvitado from "@/components/acceso/BotonInvitado";
import Casilla from "@/components/acceso/Casilla";
import { guardarSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Entrar() {
  const router = useRouter();
  const { t } = useIdioma();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("reposo");

  function validar() {
    const e = {};
    if (!correo.trim()) e.correo = t.acceso.faltaCorreo;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      e.correo = t.acceso.correoInvalido;
    if (!clave) e.clave = t.acceso.faltaClave;
    return e;
  }

  async function enviar(evento) {
    evento.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    setEstado("cargando");
    // Sin base de datos todavía: simulamos la latencia de la petición real.
    await new Promise((r) => setTimeout(r, 1300));
    guardarSesion({
      nombre: correo.split("@")[0],
      correo,
      rol: "estudiante",
      invitado: false,
    });
    setEstado("listo");
    setTimeout(() => router.push("/analizar"), 850);
  }

  return (
    <div className="animate-aparecer">
      {/* Marca, solo en móvil (en escritorio ya está en el panel izquierdo) */}
      <Link href="/" className="mb-9 inline-flex items-baseline gap-2 lg:hidden">
        <span className="titulo text-2xl font-semibold text-tinta">Diagnos</span>
        <span className="etiqueta">{t.nav.lema}</span>
      </Link>

      <CambioAcceso />

      <header className="mt-8">
        <h1 className="titulo text-4xl font-semibold leading-tight text-tinta">
          {t.acceso.entrarTitulo}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-acero">
          {t.acceso.entrarEntrada}
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
            if (errores.correo) setErrores((e) => ({ ...e, correo: null }));
          }}
          error={errores.correo}
          autoComplete="email"
          retraso={60}
        />

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
          autoComplete="current-password"
          retraso={140}
        />

        <div
          className="mb-6 flex animate-aparecer items-center justify-between gap-4"
          style={{ animationDelay: "220ms" }}
        >
          <Casilla id="recordar" marcada={recordar} onChange={setRecordar}>
            {t.acceso.recordar}
          </Casilla>
          <Link
            href="/recuperar"
            className="shrink-0 text-sm text-cobalto hover:underline hover:underline-offset-4"
          >
            {t.acceso.olvidaste}
          </Link>
        </div>

        <div className="animate-aparecer" style={{ animationDelay: "300ms" }}>
          <BotonEnvio
            estado={estado}
            textoCargando={t.acceso.entrarCargando}
            textoListo={t.acceso.entrarListo}
          >
            {t.acceso.entrarBoton}
          </BotonEnvio>
        </div>
      </form>

      <div
        className="my-6 flex animate-aparecer items-center gap-4 text-[11px] uppercase tracking-etiqueta text-acero"
        style={{ animationDelay: "380ms" }}
      >
        <span className="h-px flex-1 bg-hielo" />
        {t.acceso.separadorEntrar}
        <span className="h-px flex-1 bg-hielo" />
      </div>

      <div className="animate-aparecer" style={{ animationDelay: "440ms" }}>
        <BotonInvitado />
        <p className="mt-3 text-center text-xs leading-relaxed text-acero">
          {t.acceso.invitadoNota}
        </p>
      </div>

      <p
        className="mt-9 animate-aparecer text-center text-sm text-acero"
        style={{ animationDelay: "500ms" }}
      >
        {t.acceso.sinCuenta}{" "}
        <Link
          href="/registro"
          className="font-medium text-cobalto hover:underline hover:underline-offset-4"
        >
          {t.acceso.creaUna}
        </Link>
      </p>
    </div>
  );
}
