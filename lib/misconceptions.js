/**
 * Catálogo pedagógico de concepciones erróneas (misconceptions)
 * para álgebra de primer año de secundaria.
 *
 * Cada entrada tiene un código estable que la IA usa para clasificar,
 * lo que permite agregar estadísticas por aula en el panel docente.
 * Basado en taxonomías clásicas de errores algebraicos documentadas
 * en la investigación en educación matemática.
 *
 * El código es estable y NO se traduce: es la clave que se guarda en la
 * base de datos. Solo el nombre y la descripción tienen versión por idioma.
 */

export const CATALOGO = [
  {
    codigo: "SIG-01",
    en: {
      nombre: "Transposing without changing the sign",
      descripcion:
        "When moving a term to the other side of the equation, the student keeps its original sign instead of inverting it.",
    },
    es: {
      nombre: "Transposición sin cambio de signo",
      descripcion:
        "Al mover un término al otro lado de la ecuación, el estudiante conserva el signo original en lugar de invertirlo.",
    },
  },
  {
    codigo: "SIG-02",
    en: {
      nombre: "Incomplete distribution of the negative sign",
      descripcion:
        "When distributing a negative over parentheses, it is applied only to the first term: −(a + b) becomes −a + b.",
    },
    es: {
      nombre: "Distribución incompleta del signo negativo",
      descripcion:
        "Al distribuir un negativo sobre un paréntesis, solo se aplica al primer término: −(a + b) se convierte en −a + b.",
    },
  },
  {
    codigo: "OPS-01",
    en: {
      nombre: "Reversed order of operations",
      descripcion:
        "Addition or subtraction is performed before multiplication or division, ignoring operator precedence.",
    },
    es: {
      nombre: "Orden de operaciones invertido",
      descripcion:
        "Se suma o resta antes de multiplicar o dividir, ignorando la jerarquía de operaciones.",
    },
  },
  {
    codigo: "OPS-02",
    en: {
      nombre: "Illusion of linearity",
      descripcion:
        "Every operation is assumed to distribute: (a + b)² = a² + b², or √(a + b) = √a + √b.",
    },
    es: {
      nombre: "Linealidad ilusoria",
      descripcion:
        "Se asume que toda operación se distribuye: (a + b)² = a² + b², o √(a + b) = √a + √b.",
    },
  },
  {
    codigo: "VAR-01",
    en: {
      nombre: "Concatenation read as addition",
      descripcion:
        "3x is read as 3 + x, confusing multiplicative notation with additive notation.",
    },
    es: {
      nombre: "Concatenación como suma",
      descripcion:
        "Se interpreta 3x como 3 + x, confundiendo la notación multiplicativa con aditiva.",
    },
  },
  {
    codigo: "VAR-02",
    en: {
      nombre: "Combining unlike terms",
      descripcion:
        "Terms that are not alike are added together: 2x + 3x² becomes 5x² or 5x³.",
    },
    es: {
      nombre: "Combinación de términos no semejantes",
      descripcion:
        "Se suman términos que no son semejantes: 2x + 3x² se convierte en 5x² o 5x³.",
    },
  },
  {
    codigo: "EQU-01",
    en: {
      nombre: "Operating on one side only",
      descripcion:
        "An operation is applied to a single side of the equation, breaking the equality.",
    },
    es: {
      nombre: "Operación aplicada a un solo lado",
      descripcion:
        "Se opera sobre un solo miembro de la ecuación, rompiendo la igualdad.",
    },
  },
  {
    codigo: "EQU-02",
    en: {
      nombre: "The equals sign as a 'result'",
      descripcion:
        "The = sign is used as a 'do the next step' arrow rather than a relation of equivalence, chaining false equalities.",
    },
    es: {
      nombre: "El signo igual como 'resultado'",
      descripcion:
        "Se usa el signo = como flecha de cálculo y no como relación de equivalencia, encadenando igualdades falsas.",
    },
  },
  {
    codigo: "FRA-01",
    en: {
      nombre: "Improper cancellation in fractions",
      descripcion:
        "Addends are cancelled instead of factors: (x + 3)/3 is simplified to x.",
    },
    es: {
      nombre: "Cancelación indebida en fracciones",
      descripcion:
        "Se cancelan sumandos en lugar de factores: (x + 3)/3 se simplifica a x.",
    },
  },
  {
    codigo: "FRA-02",
    en: {
      nombre: "Adding fractions term by term",
      descripcion:
        "Numerators and denominators are added separately: a/b + c/d = (a+c)/(b+d).",
    },
    es: {
      nombre: "Suma de fracciones término a término",
      descripcion:
        "Se suman numeradores y denominadores por separado: a/b + c/d = (a+c)/(b+d).",
    },
  },
  {
    codigo: "MUL-01",
    en: {
      nombre: "Multiplying always makes it bigger",
      descripcion:
        "Multiplication is assumed to produce a larger number and division a smaller one, which fails with fractions and negatives.",
    },
    es: {
      nombre: "Multiplicar siempre agranda",
      descripcion:
        "Se asume que multiplicar produce un número mayor y dividir uno menor, lo que falla con fracciones y negativos.",
    },
  },
  {
    codigo: "OTr-00",
    en: {
      nombre: "Arithmetic slip",
      descripcion:
        "The algebraic reasoning is sound, but there is a one-off arithmetic error (times table, addition, subtraction).",
    },
    es: {
      nombre: "Error de cálculo aritmético",
      descripcion:
        "El razonamiento algebraico es correcto, pero hay un error aritmético puntual (tabla, suma, resta).",
    },
  },
];

/** Códigos válidos, para restringir por esquema lo que puede devolver el modelo. */
export const CODIGOS = CATALOGO.map((m) => m.codigo);

export function buscarPorCodigo(codigo) {
  return CATALOGO.find((m) => m.codigo === codigo) || null;
}

/**
 * Devuelve { nombre, descripcion } de una entrada en el idioma pedido,
 * con el inglés como respaldo.
 */
export function textoMisconception(entrada, idioma = "en") {
  if (!entrada) return null;
  return entrada[idioma] || entrada.en;
}

export function catalogoParaPrompt(idioma = "en") {
  return CATALOGO.map((m) => {
    const t = textoMisconception(m, idioma);
    return `- ${m.codigo} · ${t.nombre}: ${t.descripcion}`;
  }).join("\n");
}
