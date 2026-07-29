"use client";

import { useState } from "react";
import CabeceraPagina from "@/components/CabeceraPagina";
import CampoFlotante from "@/components/acceso/CampoFlotante";
import BotonEnvio from "@/components/acceso/BotonEnvio";
import RevelarAlScroll from "@/components/RevelarAlScroll";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Contacto() {
  const { t } = useIdioma();
  const c = t.paginas.contacto;
  const f = c.formulario;

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("reposo");
  const [enviado, setEnviado] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [trampa, setTrampa] = useState("");

  function validar() {
    const e = {};
    if (!nombre.trim()) e.nombre = f.faltaNombre;
    if (!correo.trim()) e.correo = t.acceso.faltaCorreo;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      e.correo = t.acceso.correoInvalido;
    if (!asunto.trim()) e.asunto = f.faltaAsunto;
    if (!mensaje.trim()) e.mensaje = f.faltaMensaje;
    return e;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setAviso(null);

    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    setEstado("cargando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          asunto: asunto.trim(),
          mensaje: mensaje.trim(),
          idioma,
          web: trampa, // campo oculto: si viene relleno, es un bot
        }),
      });
      if (!res.ok) throw new Error("envio");
      setEstado("listo");
      setTimeout(() => setEnviado(true), 800);
    } catch {
      setEstado("reposo");
      setAviso(f.errorEnvio);
    }
  }

  function reiniciar() {
    setNombre("");
    setCorreo("");
    setAsunto("");
    setMensaje("");
    setErrores({});
    setEstado("reposo");
    setEnviado(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <CabeceraPagina etiqueta={c.etiqueta} titulo={c.titulo} entrada={c.entrada} />

      {/* ---------- Canales ---------- */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {c.canales.map((canal, i) => (
          <RevelarAlScroll
            key={canal.titulo}
            retraso={i * 100}
            className="tarjeta tarjeta-viva p-6"
          >
            <p className="etiqueta">{canal.titulo}</p>
            <p className="titulo mt-2 break-words text-lg font-semibold text-cobalto">
              {canal.valor}
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-acero">
              {canal.detalle}
            </p>
          </RevelarAlScroll>
        ))}
      </div>

      {/* ---------- Formulario ---------- */}
      <section id="problema" className="mt-14 scroll-mt-24">
        <div className="tarjeta p-6 shadow-tarjeta sm:p-9">
          {!enviado ? (
            <>
              <h2 className="titulo text-2xl font-semibold">{f.titulo}</h2>
              <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-acero">
                {f.entrada}
              </p>

              <form onSubmit={enviar} noValidate className="mt-7">
                <div className="grid gap-x-5 sm:grid-cols-2">
                  <CampoFlotante
                    id="nombre"
                    etiqueta={f.nombre}
                    valor={nombre}
                    onChange={(v) => {
                      setNombre(v);
                      if (errores.nombre) setErrores((e) => ({ ...e, nombre: null }));
                    }}
                    error={errores.nombre}
                    autoComplete="name"
                    retraso={40}
                  />
                  <CampoFlotante
                    id="correo"
                    etiqueta={f.correo}
                    tipo="email"
                    valor={correo}
                    onChange={(v) => {
                      setCorreo(v);
                      if (errores.correo) setErrores((e) => ({ ...e, correo: null }));
                    }}
                    error={errores.correo}
                    autoComplete="email"
                    retraso={100}
                  />
                </div>

                <CampoFlotante
                  id="asunto"
                  etiqueta={f.asunto}
                  valor={asunto}
                  onChange={(v) => {
                    setAsunto(v);
                    if (errores.asunto) setErrores((e) => ({ ...e, asunto: null }));
                  }}
                  error={errores.asunto}
                  retraso={160}
                />

                <div className="animate-aparecer" style={{ animationDelay: "220ms" }}>
                  <div className="relative">
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={5}
                      value={mensaje}
                      onChange={(e) => {
                        setMensaje(e.target.value);
                        if (errores.mensaje)
                          setErrores((x) => ({ ...x, mensaje: null }));
                      }}
                      placeholder=" "
                      aria-invalid={Boolean(errores.mensaje)}
                      className={`peer campo-flotante resize-y ${
                        errores.mensaje ? "campo-flotante-error" : ""
                      }`}
                    />
                    <label htmlFor="mensaje" className="etiqueta-flotante">
                      {f.mensaje}
                    </label>
                  </div>
                  <div className="h-5 pl-1 pt-1">
                    {errores.mensaje && (
                      <p role="alert" className="animate-aparecer text-xs text-ambar">
                        {errores.mensaje}
                      </p>
                    )}
                  </div>
                </div>

                {/* Trampa para bots: invisible y fuera del orden de tabulación */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="web">No rellenar</label>
                  <input
                    id="web"
                    name="web"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={trampa}
                    onChange={(e) => setTrampa(e.target.value)}
                  />
                </div>

                {aviso && (
                  <p
                    role="alert"
                    className="mb-4 animate-aparecer rounded-2xl border border-ambar/40 bg-ambar/10 px-4 py-3 text-sm text-tinta"
                  >
                    {aviso}
                  </p>
                )}

                <div
                  className="mt-2 animate-aparecer sm:max-w-xs"
                  style={{ animationDelay: "280ms" }}
                >
                  <BotonEnvio
                    estado={estado}
                    textoCargando={f.enviando}
                    textoListo={f.enviado}
                  >
                    {f.enviar}
                  </BotonEnvio>
                </div>
              </form>
            </>
          ) : (
            /* ---------- Confirmación ---------- */
            <div className="animate-aparecer py-6 text-center">
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
                    strokeWidth="2.2"
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
              </div>

              <h2 className="titulo mt-6 text-3xl font-semibold text-tinta">
                {f.exitoTitulo}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-acero">
                {f.exitoTexto}
              </p>
              <button
                type="button"
                onClick={reiniciar}
                className="boton-secundario mt-7"
              >
                {f.otro}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
