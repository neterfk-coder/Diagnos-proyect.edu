"use client";

import { useRef, useState } from "react";
import Avatar, { COLORES_PERFIL } from "@/components/perfil/Avatar";
import { useSesion } from "@/lib/sesion";
import { useIdioma } from "@/lib/i18n/contexto";

const MAX_BIO = 160;
/** Lado del avatar guardado. A 128 px la foto pesa unos 6 KB en JPEG. */
const LADO_AVATAR = 128;
/**
 * Tope del data URI. Las preferencias de Appwrite se cortan en 64 KB
 * (comprobado: 60 KB pasa, 64 KB devuelve 400), y ahí también viven el rol,
 * el aula y la descripción, así que el avatar se queda muy por debajo.
 */
const MAX_AVATAR = 24 * 1024;
/** Calidades a probar, de mejor a peor, hasta que quepa. */
const CALIDADES = [0.72, 0.6, 0.48, 0.36, 0.25];

/**
 * Recorta la imagen a un cuadrado centrado y la reduce.
 * Va como data URI dentro de las preferencias de la cuenta, así que tiene
 * que ser pequeña: un recorte cuadrado evita además que las fotos verticales
 * se deformen dentro del círculo.
 */
function prepararAvatar(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const lado = Math.min(img.width, img.height);
      const lienzo = document.createElement("canvas");
      lienzo.width = LADO_AVATAR;
      lienzo.height = LADO_AVATAR;
      const ctx = lienzo.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        (img.width - lado) / 2,
        (img.height - lado) / 2,
        lado,
        lado,
        0,
        0,
        LADO_AVATAR,
        LADO_AVATAR
      );

      // Una foto muy detallada puede pasarse del tope aunque mida 128 px,
      // así que se baja la calidad hasta que quepa. Guardar algo que el
      // servidor va a rechazar daría un error sin explicación al usuario.
      let datos = lienzo.toDataURL("image/jpeg", CALIDADES[0]);
      for (let i = 1; i < CALIDADES.length && datos.length > MAX_AVATAR; i++) {
        datos = lienzo.toDataURL("image/jpeg", CALIDADES[i]);
      }

      if (datos.length > MAX_AVATAR) {
        reject(new Error("demasiado pesada"));
        return;
      }
      resolve(datos);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagen ilegible"));
    };
    img.src = url;
  });
}

export default function EditorPerfil({ sesion }) {
  const { t } = useIdioma();
  const { personalizar } = useSesion();
  const p = t.paginas.perfil;

  const [nombre, setNombre] = useState(sesion.nombre || "");
  const [bio, setBio] = useState(sesion.bio || "");
  const [color, setColor] = useState(sesion.color || "ambar");
  const [avatar, setAvatar] = useState(sesion.avatar || null);
  const [estado, setEstado] = useState("reposo");
  const [aviso, setAviso] = useState(null);
  const entrada = useRef(null);

  // Vista previa inmediata: se compone una sesión falsa con lo que hay en el
  // formulario, para que el avatar refleje los cambios antes de guardarlos.
  const previa = { ...sesion, nombre, color, avatar };

  async function elegirFoto(archivo) {
    if (!archivo || !archivo.type.startsWith("image/")) return;
    setAviso(null);
    try {
      setAvatar(await prepararAvatar(archivo));
    } catch {
      setAviso(p.avatarError);
    }
  }

  async function guardar() {
    setEstado("guardando");
    setAviso(null);
    try {
      await personalizar({ nombre: nombre.trim(), bio: bio.trim(), color, avatar });
      setEstado("guardado");
      setTimeout(() => setEstado("reposo"), 2200);
    } catch {
      setEstado("reposo");
      setAviso(p.guardarError);
    }
  }

  const sinCambios =
    nombre.trim() === (sesion.nombre || "") &&
    bio.trim() === (sesion.bio || "") &&
    color === (sesion.color || "ambar") &&
    avatar === (sesion.avatar || null);

  return (
    <div className="tarjeta animate-aparecer p-6 sm:p-8">
      <h3 className="titulo text-xl font-semibold text-white">{p.personalizar}</h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-acero">
        {p.personalizarTexto}
      </p>

      {/* Avatar */}
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <Avatar sesion={previa} tam={84} anillo />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            className="boton-secundario !px-5 !py-2 text-xs"
          >
            {avatar ? p.avatarCambiar : p.avatarSubir}
          </button>
          {avatar && (
            <button
              type="button"
              onClick={() => setAvatar(null)}
              className="text-xs text-acero underline underline-offset-4 transition-colors hover:text-ambar"
            >
              {p.avatarQuitar}
            </button>
          )}
          <input
            ref={entrada}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => elegirFoto(e.target.files?.[0])}
          />
        </div>
      </div>

      {/* Color */}
      <p className="etiqueta mt-7">{p.color}</p>
      <div className="mt-2.5 flex flex-wrap gap-2.5">
        {Object.entries(COLORES_PERFIL).map(([id, paleta]) => (
          <button
            key={id}
            type="button"
            onClick={() => setColor(id)}
            aria-label={id}
            aria-pressed={color === id}
            className={`h-8 w-8 rounded-full transition-all duration-300 ${paleta.fondo} ${
              color === id
                ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-papel"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
          />
        ))}
      </div>

      {/* Nombre */}
      <div className="mt-7">
        <label htmlFor="nombre-perfil" className="etiqueta mb-2 block">
          {p.campos.nombre}
        </label>
        <input
          id="nombre-perfil"
          value={nombre}
          maxLength={60}
          onChange={(e) => setNombre(e.target.value)}
          className="campo"
        />
      </div>

      {/* Descripción */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="bio-perfil" className="etiqueta">
            {p.bio}
          </label>
          <span
            translate="no"
            className={`notranslate font-mono text-[11px] ${
              bio.length > MAX_BIO - 20 ? "text-ambar" : "text-acero"
            }`}
          >
            {bio.length}/{MAX_BIO}
          </span>
        </div>
        <textarea
          id="bio-perfil"
          rows={3}
          value={bio}
          maxLength={MAX_BIO}
          onChange={(e) => setBio(e.target.value)}
          placeholder={p.bioMarcador}
          className="campo resize-none leading-relaxed"
        />
      </div>

      {aviso && (
        <p className="mt-4 rounded-2xl border border-ambar/40 bg-ambar/10 px-4 py-2.5 text-sm text-tinta">
          {aviso}
        </p>
      )}

      <button
        type="button"
        onClick={guardar}
        disabled={estado === "guardando" || sinCambios}
        className="boton-primario mt-6 !px-6 !py-2.5 text-xs"
      >
        {estado === "guardando"
          ? p.guardando
          : estado === "guardado"
          ? p.guardado
          : p.guardar}
      </button>
    </div>
  );
}
