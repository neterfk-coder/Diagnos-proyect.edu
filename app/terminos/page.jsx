"use client";

import PaginaLegal from "@/components/PaginaLegal";
import { useIdioma } from "@/lib/i18n/contexto";

export default function Terminos() {
  const { t } = useIdioma();
  return <PaginaLegal contenido={t.paginas.terminos} />;
}
