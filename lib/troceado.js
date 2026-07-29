/**
 * Trocea un texto largo en fragmentos de tamaño aproximado, cortando por
 * el salto de párrafo o de frase más cercano en vez de a mitad de palabra:
 * un trozo que empieza a media frase produce resúmenes peores.
 */
export function trocear(texto, tamano) {
  const limpio = String(texto || "").trim();
  if (limpio.length <= tamano) return limpio ? [limpio] : [];

  const trozos = [];
  let desde = 0;

  while (desde < limpio.length) {
    let hasta = Math.min(desde + tamano, limpio.length);

    if (hasta < limpio.length) {
      // Se busca un corte limpio en el último 20% del trozo
      const margen = Math.floor(tamano * 0.2);
      const ventana = limpio.slice(hasta - margen, hasta);

      const parrafo = ventana.lastIndexOf("\n\n");
      const frase = Math.max(
        ventana.lastIndexOf(". "),
        ventana.lastIndexOf(".\n")
      );
      const salto = ventana.lastIndexOf("\n");
      // El espacio es el último recurso: un PDF cuyo texto venga en un solo
      // párrafo largo no tiene saltos ni puntos donde cortar, y sin esto el
      // corte caía a mitad de palabra y cada trozo empezaba y acababa con
      // una palabra partida.
      const espacio = ventana.lastIndexOf(" ");

      const relativo =
        parrafo >= 0
          ? parrafo
          : frase >= 0
          ? frase + 1
          : salto >= 0
          ? salto
          : espacio;
      if (relativo >= 0) hasta = hasta - margen + relativo;
    }

    const trozo = limpio.slice(desde, hasta).trim();
    if (trozo) trozos.push(trozo);
    desde = hasta;
  }

  return trozos;
}
