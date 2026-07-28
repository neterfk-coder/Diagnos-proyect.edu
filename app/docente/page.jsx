"use client";

import { useEffect, useState } from "react";
import {
  clienteAppwrite,
  BASE_DATOS,
  TABLA_DIAGNOSTICOS,
  Query,
} from "@/lib/appwrite";
import { buscarPorCodigo, textoMisconception } from "@/lib/misconceptions";
import { useIdioma } from "@/lib/i18n/contexto";
import ContadorAnimado from "@/components/ContadorAnimado";

/** Datos de respaldo para la demo cuando Appwrite aún no está configurado. */
const DATOS_DEMO = [
  { misconception: "SIG-01", total: 14 },
  { misconception: "SIG-02", total: 9 },
  { misconception: "EQU-01", total: 6 },
  { misconception: "FRA-01", total: 4 },
  { misconception: "VAR-02", total: 3 },
  { misconception: "EQU-02", total: 2 },
  { misconception: "OTr-00", total: 2 },
];

export default function PanelDocente() {
  const { t, idioma } = useIdioma();
  const [filas, setFilas] = useState(null);
  const [origen, setOrigen] = useState("demo");
  // Las barras arrancan en cero y crecen al aparecer los datos.
  const [barrasListas, setBarrasListas] = useState(false);

  useEffect(() => {
    async function cargar() {
      const bd = clienteAppwrite();
      if (!bd) {
        setFilas(DATOS_DEMO);
        return;
      }

      let registros = [];
      try {
        // Appwrite lanza en caso de error en vez de devolverlo, así que
        // va en try/catch: si falla, el panel cae a los datos de demo.
        const res = await bd.listRows({
          databaseId: BASE_DATOS,
          tableId: TABLA_DIAGNOSTICOS,
          queries: [Query.orderDesc("$createdAt"), Query.limit(500)],
        });
        registros = res.rows;
      } catch (error) {
        console.error("[docente] no se pudieron leer los diagnósticos:", error?.message || error);
      }

      if (registros.length === 0) {
        setFilas(DATOS_DEMO);
        return;
      }
      const conteo = {};
      for (const r of registros) {
        conteo[r.misconception] = (conteo[r.misconception] || 0) + 1;
      }
      const agregado = Object.entries(conteo)
        .map(([misconception, total]) => ({ misconception, total }))
        .sort((a, b) => b.total - a.total);
      setFilas(agregado);
      setOrigen("appwrite");
    }
    cargar();
  }, []);

  useEffect(() => {
    if (!filas) return;
    const t = setTimeout(() => setBarrasListas(true), 80);
    return () => clearTimeout(t);
  }, [filas]);

  const totalGeneral = filas?.reduce((s, f) => s + f.total, 0) || 0;
  const maximo = filas?.[0]?.total || 1;
  const dominante = filas?.[0]
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

      {!filas ? (
        <p className="mt-12 text-sm text-acero">{t.docente.cargando}</p>
      ) : (
        <>
          {/* Resumen */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="tarjeta tarjeta-viva p-6">
              <p className="etiqueta">{t.docente.registrados}</p>
              <p className="titulo mt-2 text-5xl font-semibold text-white">
                <ContadorAnimado valor={totalGeneral} />
              </p>
            </div>
            <div className="tarjeta tarjeta-viva p-6 sm:col-span-2">
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
          <section className="tarjeta mt-8 p-6 sm:p-8 shadow-tarjeta">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="titulo text-2xl font-semibold">
                {t.docente.mapaTitulo}
              </h2>
              <span className="font-mono text-xs text-acero">
                {origen === "appwrite" ? t.docente.envivo : t.docente.demo}
              </span>
            </div>

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
                        {f.total} {t.docente.casos} · {pct}%
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-hielo/70">
                      <div
                        className="barra-calor"
                        style={{
                          width: barrasListas
                            ? `${(f.total / maximo) * 100}%`
                            : "0%",
                          transitionDelay: `${i * 90}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sugerencia pedagógica */}
          {dominante && (
            <section className="seccion-abisal mt-8 rounded-3xl p-6 sm:p-8">
              <p className="etiqueta-clara relative">{t.docente.sugerenciaEtiqueta}</p>
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
    </div>
  );
}
