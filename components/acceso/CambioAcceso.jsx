"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIdioma } from "@/lib/i18n/contexto";

/**
 * Selector segmentado con pastilla deslizante.
 * La pastilla se mueve con transform, así que la transición es fluida
 * aunque Next.js remonte la página al cambiar de ruta.
 */
export default function CambioAcceso() {
  const ruta = usePathname();
  const { t } = useIdioma();

  const OPCIONES = [
    { href: "/entrar", texto: t.acceso.iniciarSesion },
    { href: "/registro", texto: t.acceso.crearCuenta },
  ];

  const indice = Math.max(
    0,
    OPCIONES.findIndex((o) => o.href === ruta)
  );

  return (
    <div className="relative flex rounded-full border border-hielo bg-nube p-1">
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-papel shadow-suave transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${indice * 100}%)` }}
      />
      {OPCIONES.map((o) => (
        <Link
          key={o.href}
          href={o.href}
          className={`segmento ${
            ruta === o.href ? "segmento-activo" : "segmento-inactivo"
          }`}
        >
          {o.texto}
        </Link>
      ))}
    </div>
  );
}
