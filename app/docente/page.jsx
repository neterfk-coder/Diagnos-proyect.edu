"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { buscarPorCodigo, textoMisconception } from "@/lib/misconceptions";
import { useIdioma } from "@/lib/i18n/contexto";
import { useSesion } from "@/lib/sesion";
import { crearJWT } from "@/lib/cuenta";
import ContadorAnimado from "@/components/ContadorAnimado";

/** Tarjeta centrada para los estados en los que no hay panel que mostrar. */
function Bloqueo({ titulo, texto, acciones }) {
  return (
    <div className="tarjeta mt-12 animate-aparecer p-8 text-center sm:p-10">
      <h2 className="titulo text-2xl font-semibold text-white">{titulo}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-acero">
        {texto}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">{acciones}</div>
    </div>
  );
}

export default function PanelDocente() {
  const { t, idioma } = useIdioma();
  const { sesion, cargando: cargandoSesion } = useSesion();

  const [datos, setDatos] = useState(null);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [barrasListas, setBarrasListas] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const esDocente = sesion && !sesion.invitado && sesion.rol === "docente";

  const cargar = useCallback(async () => {
    setEstado("cargando");
    try {
      const jwt = await crearJWT();
      const res = await fetch("/api/aula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwt }),
      });
      if (!res.ok) throw new Error("carga");
      setDatos(await res.json());
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  }, []);

  useEffect(() => {
    if (esDocente) cargar();
  }, [esDocente, cargar]);

  useEffect(() => {
    if (estado !== "listo") return;
    const reloj = setTimeout(() => setBarrasListas(true), 80);
    return () => clearTimeout(reloj);
  }, [estado]);

  function copiar() {
    navigator.clipboard?.writeText(datos.aula);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const filas = datos?.filas || [];
  const totalGeneral = datos?.total || 0;
  const maximo = filas[0]?.total || 1;
  const dominante = filas[0]
    ? textoMisconception(buscarPorCodigo(filas[0].misconception), idioma)
    : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="etiqueta">{t.docente.etiqueta}</p>
        <h1 className="titulo mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {t.docente.titulo}
        </h1>
        <p className="mt-3 text-base font-light leading-relaxed text-acero">
          {t.docente.entrada}
        </p>
      </header>

      {/* ---------- Comprobando sesión ---------- */}
      {cargandoSesion && (
        <div className="mt-12 h-44 animate-pulse rounded-3xl bg-hielo/30" />
      )}

      {/* ---------- Sin sesión ---------- */}
      {!cargandoSesion && (!sesion || sesion.invitado) && (
        <Bloqueo
          titulo={t.docente.entrarTitulo}
          texto={t.docente.entrarTexto}
          acciones={
            <>
              <Link href="/entrar" className="boton-acento">
                {t.docente.entrarBoton}
              </Link>
              <Link href="/registro" className="boton-secundario">
                {t.docente.registroBoton}
              </Link>
            </>
          }
        />
      )}

      {/* ---------- Con sesión, pero de estudiante ---------- */}
      {!cargandoSesion && sesion && !sesion.invitado && !esDocente && (
        <Bloqueo
          titulo={t.docente.soloDocentesTitulo}
          texto={t.docente.soloDocentesTexto}
          acciones={
            <Link href="/perfil" className="boton-acento">
              {t.docente.irAlPerfil}
            </Link>
          }
        />
      )}

      {/* ---------- Panel ---------- */}
      {esDocente && (
        <>
          {estado === "cargando" && (
            <p className="mt-12 text-sm text-acero">{t.docente.cargando}</p>
          )}

          {estado === "error" && (
            <p className="mt-12 text-sm text-ambar">{t.docente.errorCarga}</p>
          )}

          {estado === "listo" && (
            <>
              {/* Código de aula */}
              <div className="tarjeta mt-10 flex flex-wrap items-center justify-between gap-5 p-6">
                <div>
                  <p className="etiqueta">{t.docente.codigoEtiqueta}</p>
                  <p
                    translate="no"
                    className="notranslate titulo mt-1.5 text-3xl font-semibold tracking-[0.2em] text-ambar"
                  >
                    {datos.aula}
                  </p>
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-acero">
                    {t.docente.codigoTexto}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copiar}
                  className="boton-secundario !px-5 !py-2 text-xs"
                >
                  {copiado ? t.docente.copiado : t.docente.copiar}
                </button>
              </div>

              {totalGeneral === 0 ? (
                <Bloqueo
                  titulo={t.docente.sinDatosTitulo}
                  texto={t.docente.sinDatosTexto}
                  acciones={
                    <Link href="/analizar" className="boton-secundario">
                      {t.nav.analizar}
                    </Link>
                  }
                />
              ) : (
                <>
                  {/* Resumen */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="tarjeta tarjeta-viva p-6">
                      <p className="etiqueta">{t.docente.registrados}</p>
                      <p className="titulo mt-2 text-5xl font-semibold text-ambar">
                        <ContadorAnimado valor={totalGeneral} />
                      </p>
                    </div>
                    <div className="tarjeta tarjeta-viva p-6">
                      <p className="etiqueta">{t.docente.superadasTitulo}</p>
                      <p className="titulo mt-2 text-5xl font-semibold text-cobalto">
                        <ContadorAnimado valor={datos.totalSuperadas || 0} />
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-acero">
                        {t.docente.superadasTexto}
                      </p>
                    </div>
                    <div className="tarjeta tarjeta-viva p-6">
                      <p className="etiqueta">{t.docente.dominante}</p>
                      <p className="titulo mt-2 text-2xl font-semibold text-ambar">
                        {dominante ? dominante.nombre : "—"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-acero">
                        {dominante?.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Mapa de calor */}
                  <section className="tarjeta mt-8 p-6 shadow-tarjeta sm:p-8">
                    <h2 className="titulo text-2xl font-semibold text-white">
                      {t.docente.mapaTitulo}
                    </h2>

                    <div className="mt-7 space-y-5">
                      {filas.map((f, i) => {
                        const detalle = textoMisconception(
                          buscarPorCodigo(f.misconception),
                          idioma
                        );
                        const pct = Math.round((f.total / totalGeneral) * 100);
                        return (
                          <div
                            key={f.misconception}
                            className="animate-aparecer"
                            style={{ animationDelay: `${i * 90}ms` }}
                          >
                            <div className="mb-1.5 flex items-baseline justify-between gap-4">
                              <p className="text-sm text-tinta">
                                <span
                                  translate="no"
                                  className="notranslate font-mono text-xs text-acero"
                                >
                                  {f.misconception}
                                </span>{" "}
                                · {detalle ? detalle.nombre : t.docente.sinClasificar}
                              </p>
                              <p className="shrink-0 font-mono text-xs text-acero">
                                {f.total} {t.docente.casos}
                                {f.superadas > 0 && (
                                  <span className="text-cobalto">
                                    {" · "}
                                    {f.superadas} {t.docente.superadas}
                                  </span>
                                )}
                                {" · "}
                                {pct}%
                              </p>
                            </div>
                            {/* Dos capas: el error cometido en naranja y, encima,
                                la parte ya superada en azul. Así se ve de un
                                vistazo cuánto queda por re-enseñar. */}
                            <div className="relative h-2 overflow-hidden rounded-full bg-hielo/70">
                              <div
                                className="barra-calor absolute inset-y-0 left-0"
                                style={{
                                  width: barrasListas
                                    ? `${(f.total / maximo) * 100}%`
                                    : "0%",
                                  transitionDelay: `${i * 90}ms`,
                                }}
                              />
                              {f.superadas > 0 && (
                                <div
                                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-electrico to-celeste transition-all duration-700"
                                  style={{
                                    width: barrasListas
                                      ? `${(Math.min(f.superadas, f.total) / maximo) * 100}%`
                                      : "0%",
                                    transitionDelay: `${i * 90 + 250}ms`,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Sugerencia pedagógica */}
                  {dominante && (
                    <section className="seccion-abisal mt-8 rounded-3xl p-6 sm:p-8">
                      <p className="etiqueta-clara relative">
                        {t.docente.sugerenciaEtiqueta}
                      </p>
                      <p className="titulo relative mt-3 text-xl font-semibold leading-snug text-white">
                        {t.docente.sugerenciaTitulo1}
                        {dominante.nombre.toLowerCase()}
                        {t.docente.sugerenciaTitulo2}
                      </p>
                      <p className="relative mt-3 max-w-2xl text-sm font-light leading-relaxed text-bruma">
                        {t.docente.sugerenciaTexto}
                      </p>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
