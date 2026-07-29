"use client";

/** Colores que el usuario puede elegir para su perfil. */
export const COLORES_PERFIL = {
  ambar: { fondo: "bg-ambar", texto: "text-abismo", anillo: "ring-ambar/40" },
  electrico: { fondo: "bg-electrico", texto: "text-abismo", anillo: "ring-electrico/40" },
  celeste: { fondo: "bg-celeste", texto: "text-abismo", anillo: "ring-celeste/40" },
  marino: { fondo: "bg-marino", texto: "text-white", anillo: "ring-marino/50" },
  blanco: { fondo: "bg-tinta", texto: "text-abismo", anillo: "ring-tinta/30" },
};

/**
 * Avatar del usuario: su foto si la tiene, y si no la inicial sobre el color
 * que haya elegido. El invitado siempre lleva estrella.
 */
export default function Avatar({ sesion, tam = 40, anillo = false }) {
  const paleta = COLORES_PERFIL[sesion?.color] || COLORES_PERFIL.ambar;
  const inicial = (sesion?.nombre || "?").trim().charAt(0).toUpperCase();
  const estilo = { width: tam, height: tam, fontSize: Math.round(tam * 0.4) };

  if (sesion?.invitado) {
    return (
      <span
        translate="no"
        style={estilo}
        className="notranslate grid shrink-0 place-items-center rounded-full border border-hielo bg-nube text-acero"
      >
        ★
      </span>
    );
  }

  if (sesion?.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sesion.avatar}
        alt={sesion.nombre}
        style={{ width: tam, height: tam }}
        className={`shrink-0 rounded-full object-cover ${
          anillo ? `ring-4 ${paleta.anillo}` : ""
        }`}
      />
    );
  }

  return (
    <span
      translate="no"
      style={estilo}
      className={`notranslate grid shrink-0 place-items-center rounded-full font-semibold ${
        paleta.fondo
      } ${paleta.texto} ${anillo ? `ring-4 ${paleta.anillo}` : ""}`}
    >
      {inicial}
    </span>
  );
}
