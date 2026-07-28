"use client";

import PaginaLegal from "@/components/PaginaLegal";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Privacidad() {
  const { t } = useIdioma();
  return <PaginaLegal contenido={t.paginas.privacidad} />;
}
