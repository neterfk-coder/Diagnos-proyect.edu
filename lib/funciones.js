/**
 * Catálogo de funciones que el estudiante puede representar.
 *
 * Todas se dibujan con la forma  y = a · f(b·x + c) + d,  para que se vea
 * qué hace cada parámetro: amplitud, frecuencia, desplazamiento horizontal
 * y vertical. Es la manera más directa de entender una familia de curvas.
 */

export const FAMILIAS = {
  trigonometrica: "trigonometrica",
  algebraica: "algebraica",
};

export const FUNCIONES = [
  // --- Trigonométricas ---
  { id: "sin", etiqueta: "sen", familia: FAMILIAS.trigonometrica, f: Math.sin },
  { id: "cos", etiqueta: "cos", familia: FAMILIAS.trigonometrica, f: Math.cos },
  { id: "tan", etiqueta: "tan", familia: FAMILIAS.trigonometrica, f: Math.tan },
  {
    id: "sec",
    etiqueta: "sec",
    familia: FAMILIAS.trigonometrica,
    f: (x) => 1 / Math.cos(x),
  },
  {
    id: "csc",
    etiqueta: "csc",
    familia: FAMILIAS.trigonometrica,
    f: (x) => 1 / Math.sin(x),
  },
  {
    id: "cot",
    etiqueta: "cot",
    familia: FAMILIAS.trigonometrica,
    f: (x) => 1 / Math.tan(x),
  },

  // --- Algebraicas ---
  { id: "lineal", etiqueta: "x", familia: FAMILIAS.algebraica, f: (x) => x },
  { id: "cuadratica", etiqueta: "x²", familia: FAMILIAS.algebraica, f: (x) => x * x },
  { id: "cubica", etiqueta: "x³", familia: FAMILIAS.algebraica, f: (x) => x ** 3 },
  {
    id: "raiz",
    etiqueta: "√x",
    familia: FAMILIAS.algebraica,
    f: (x) => (x < 0 ? NaN : Math.sqrt(x)),
  },
  {
    id: "inversa",
    etiqueta: "1/x",
    familia: FAMILIAS.algebraica,
    f: (x) => 1 / x,
  },
  { id: "absoluto", etiqueta: "|x|", familia: FAMILIAS.algebraica, f: Math.abs },
  {
    id: "exponencial",
    etiqueta: "eˣ",
    familia: FAMILIAS.algebraica,
    f: Math.exp,
  },
  {
    id: "logaritmo",
    etiqueta: "ln x",
    familia: FAMILIAS.algebraica,
    f: (x) => (x <= 0 ? NaN : Math.log(x)),
  },
];

export function buscarFuncion(id) {
  return FUNCIONES.find((f) => f.id === id) || FUNCIONES[0];
}

/** Evalúa y = a·f(b·x + c) + d */
export function evaluar(funcion, x, { a, b, c, d }) {
  const y = funcion.f(b * x + c);
  return a * y + d;
}

/** Redondea sin arrastrar ceros: 2 -> "2", 2.5 -> "2.5" */
function limpio(n) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
}

/**
 * Fórmula legible, omitiendo los términos neutros.
 * Escribir "y = 1·sen(1x + 0) + 0" no ayuda a nadie.
 */
export function formula(funcion, { a, b, c, d }, nombre) {
  const et = nombre || funcion.etiqueta;

  let interior = "";
  if (funcion.familia === FAMILIAS.algebraica && funcion.id === "lineal") {
    interior = b === 1 ? "x" : `${limpio(b)}x`;
  } else {
    interior = b === 1 ? "x" : `${limpio(b)}x`;
  }
  if (c > 0) interior += ` + ${limpio(c)}`;
  else if (c < 0) interior += ` − ${limpio(Math.abs(c))}`;

  // La lineal no lleva paréntesis: "2x + 1" se lee mejor que "2(x) + 1"
  let cuerpo =
    funcion.id === "lineal" ? interior : `${et}(${interior})`;

  if (a !== 1) cuerpo = a === -1 ? `−${cuerpo}` : `${limpio(a)}·${cuerpo}`;

  let salida = `y = ${cuerpo}`;
  if (d > 0) salida += ` + ${limpio(d)}`;
  else if (d < 0) salida += ` − ${limpio(Math.abs(d))}`;
  return salida;
}

/**
 * Muestrea la curva y la parte en tramos.
 *
 * Un solo trazo continuo uniría las ramas de la tangente con una recta
 * vertical falsa que atraviesa toda la gráfica. Aquí se corta el trazo
 * cuando el valor deja de ser finito, cuando se sale mucho del encuadre,
 * o cuando pega un salto grande cambiando de signo: eso es una asíntota.
 */
export function muestrear(funcion, params, vista, muestras = 1400) {
  const { xMin, xMax, yMin, yMax } = vista;
  const paso = (xMax - xMin) / muestras;
  const alto = yMax - yMin;

  const tramos = [];
  let actual = [];
  let previo = null;

  for (let i = 0; i <= muestras; i++) {
    const x = xMin + i * paso;
    const y = evaluar(funcion, x, params);

    const valido = Number.isFinite(y);
    // Se permite salir un poco del encuadre para que la curva llegue al borde
    const dentro = valido && y > yMin - alto * 2 && y < yMax + alto * 2;

    if (!valido) {
      if (actual.length > 1) tramos.push(actual);
      actual = [];
      previo = null;
      continue;
    }

    const saltoBrusco =
      previo !== null &&
      Math.abs(y - previo) > alto * 0.8 &&
      Math.sign(y) !== Math.sign(previo);

    if (saltoBrusco) {
      if (actual.length > 1) tramos.push(actual);
      actual = [];
    }

    if (dentro) actual.push([x, y]);
    else if (actual.length > 1) {
      tramos.push(actual);
      actual = [];
    }

    previo = y;
  }

  if (actual.length > 1) tramos.push(actual);
  return tramos;
}

/**
 * Posiciones aproximadas de las asíntotas verticales, detectadas por el
 * cambio de signo con magnitud disparada. Vale para cualquier función sin
 * tener que resolverla analíticamente.
 */
export function asintotas(funcion, params, vista, muestras = 1200) {
  const { xMin, xMax } = vista;
  const paso = (xMax - xMin) / muestras;
  const UMBRAL = 60;

  // Se buscan REGIONES donde la función se dispara, en vez de un cambio de
  // signo puntual: si el muestreo cae justo en el punto donde vale
  // infinito, no hay dos valores finitos que comparar y la asíntota se
  // escapaba. La asíntota es el centro de cada región disparada.
  const encontradas = [];
  let inicio = null;

  for (let i = 0; i <= muestras; i++) {
    const x = xMin + i * paso;
    const y = evaluar(funcion, x, params);
    const disparado = !Number.isFinite(y) || Math.abs(y) > UMBRAL;

    if (disparado && inicio === null) inicio = x;
    else if (!disparado && inicio !== null) {
      encontradas.push((inicio + (x - paso)) / 2);
      inicio = null;
    }
  }

  // Una región abierta al llegar al borde no se cierra dentro del encuadre
  if (inicio !== null && inicio > xMin + paso) {
    encontradas.push((inicio + xMax) / 2);
  }

  return encontradas;
}

/** Marcas del eje X. En las trigonométricas van en múltiplos de π/2. */
export function marcasX(funcion, vista) {
  const { xMin, xMax } = vista;
  const marcas = [];

  if (funcion.familia === FAMILIAS.trigonometrica) {
    const paso = Math.PI / 2;
    const desde = Math.ceil(xMin / paso);
    const hasta = Math.floor(xMax / paso);
    for (let k = desde; k <= hasta; k++) {
      if (k === 0) continue;
      marcas.push({ x: k * paso, texto: etiquetaPi(k) });
    }
    return marcas;
  }

  const rango = xMax - xMin;
  const paso = rango > 40 ? 10 : rango > 16 ? 5 : rango > 8 ? 2 : 1;
  const desde = Math.ceil(xMin / paso) * paso;
  for (let x = desde; x <= xMax; x += paso) {
    if (Math.abs(x) < 1e-9) continue;
    marcas.push({ x, texto: String(Math.round(x * 100) / 100) });
  }
  return marcas;
}

/** k medios-pi como texto: 2 -> "π", 3 -> "3π/2", -1 -> "−π/2" */
function etiquetaPi(k) {
  const signo = k < 0 ? "−" : "";
  const n = Math.abs(k);
  if (n % 2 === 0) return `${signo}${n / 2 === 1 ? "" : n / 2}π`;
  return `${signo}${n === 1 ? "" : n}π/2`;
}

export function marcasY(vista) {
  const { yMin, yMax } = vista;
  const rango = yMax - yMin;
  const paso = rango > 40 ? 10 : rango > 16 ? 5 : rango > 8 ? 2 : 1;
  const marcas = [];
  const desde = Math.ceil(yMin / paso) * paso;
  for (let y = desde; y <= yMax; y += paso) {
    if (Math.abs(y) < 1e-9) continue;
    marcas.push({ y, texto: String(Math.round(y * 100) / 100) });
  }
  return marcas;
}
