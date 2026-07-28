"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CambioAcceso from "@/components/acceso/CambioAcceso";
import CampoFlotante from "@/components/acceso/CampoFlotante";
import BotonEnvio from "@/components/acceso/BotonEnvio";
import BotonInvitado from "@/components/acceso/BotonInvitado";
import AvisoAcceso from "@/components/acceso/AvisoAcceso";
import { useSesion } from "@/lib/sesion";
import { claveDeError } from "@/lib/cuenta";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Entrar() {
  const router = useRouter();
  const { t } = useIdioma();
  const { entrar, hayCuentas } = useSesion();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
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
    setAviso(null);

    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    if (!hayCuentas) return setAviso(t.acceso.errores.sinCuentas);

    setEstado("cargando");
    try {
      const usuario = await entrar(correo.trim(), clave);
      setEstado("listo");
      const destino = usuario?.prefs?.rol === "docente" ? "/docente" : "/analizar";
      setTimeout(() => router.push(destino), 700);
    } catch (error) {
      setEstado("reposo");
      setAviso(t.acceso.errores[claveDeError(error)] || t.acceso.errores.generico);
    }
  }

  return (
    <div className="animate-aparecer">
      {/* Marca, solo en móvil (en escritorio ya está en el panel izquierdo) */}
      <Link href="/" className="mb-9 inline-flex items-baseline gap-2 lg:hidden">
        <span className="titulo text-2xl font-semibold text-white">Diagnos</span>
        <span className="etiqueta">{t.nav.lema}</span>
      </Link>

      <CambioAcceso />

      <header className="mt-8">
        <h1 className="titulo text-4xl font-semibold leading-tight text-white">
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
          className="mb-6 flex animate-aparecer justify-end"
          style={{ animationDelay: "220ms" }}
        >
          <Link
            href="/recuperar"
            className="text-sm text-cobalto transition-colors hover:text-celeste hover:underline hover:underline-offset-4"
          >
            {t.acceso.olvidaste}
          </Link>
        </div>

        <AvisoAcceso mensaje={aviso} />

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
          className="font-medium text-cobalto transition-colors hover:text-celeste hover:underline hover:underline-offset-4"
        >
          {t.acceso.creaUna}
        </Link>
      </p>
    </div>
  );
}
