/**
 * Catálogo pedagógico de concepciones erróneas (misconceptions)
 * para álgebra de primer año de secundaria.
 *
 * Cada entrada tiene un código estable que la IA usa para clasificar,
 * lo que permite agregar estadísticas por aula en el panel docente.
 *
 * El campo `fuente` remite al trabajo donde ese error está documentado, para
 * que el catálogo sea comprobable y no una lista de etiquetas inventadas.
 * Las referencias completas están en REFERENCIAS, más abajo.
 *
 * El código es estable y NO se traduce: es la clave que se guarda en la
 * base de datos. Solo el nombre y la descripción tienen versión por idioma.
 */

/**
 * Referencias completas de las fuentes citadas en el catálogo.
 * Investigación en educación matemática sobre errores algebraicos.
 */
export const REFERENCIAS = [
  {
    clave: "Kieran (1981)",
    cita:
      "Kieran, C. (1981). Concepts associated with the equality symbol. Educational Studies in Mathematics, 12(3), 317–326.",
  },
  {
    clave: "Küchemann (1981)",
    cita:
      "Küchemann, D. (1981). Algebra. En K. Hart (Ed.), Children's Understanding of Mathematics: 11–16. John Murray.",
  },
  {
    clave: "Matz (1982)",
    cita:
      "Matz, M. (1982). Towards a process model for high school algebra errors. En D. Sleeman y J. S. Brown (Eds.), Intelligent Tutoring Systems. Academic Press.",
  },
  {
    clave: "Fischbein, Deri, Nello y Marino (1985)",
    cita:
      "Fischbein, E., Deri, M., Nello, M. S. y Marino, M. S. (1985). The role of implicit models in solving verbal problems in multiplication and division. Journal for Research in Mathematics Education, 16(1), 3–17.",
  },
  {
    clave: "De Bock, Van Dooren, Janssens y Verschaffel (2002)",
    cita:
      "De Bock, D., Van Dooren, W., Janssens, D. y Verschaffel, L. (2002). Improper use of linear reasoning: an in-depth study of the nature and the irresistibility of secondary school students' errors. Educational Studies in Mathematics, 50(3), 311–334.",
  },
  {
    clave: "Vlassis (2004)",
    cita:
      "Vlassis, J. (2004). Making sense of the minus sign or becoming flexible in 'negativity'. Learning and Instruction, 14(5), 469–484.",
  },
  {
    clave: "Ni y Zhou (2005)",
    cita:
      "Ni, Y. y Zhou, Y.-D. (2005). Teaching and learning fraction and rational numbers: the origins and implications of whole number bias. Educational Psychologist, 40(1), 27–52.",
  },
];

export function buscarReferencia(clave) {
  return REFERENCIAS.find((r) => r.clave === clave) || null;
}

export const CATALOGO = [
  {
    codigo: "SIG-01",
    fuente: "Vlassis (2004)",
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
    fuente: "Vlassis (2004)",
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
    fuente: "Matz (1982)",
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
    fuente: "De Bock, Van Dooren, Janssens y Verschaffel (2002)",
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
    fuente: "Küchemann (1981)",
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
    fuente: "Küchemann (1981)",
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
    fuente: "Kieran (1981)",
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
    fuente: "Kieran (1981)",
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
    fuente: "Matz (1982)",
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
    fuente: "Ni y Zhou (2005)",
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
    fuente: "Fischbein, Deri, Nello y Marino (1985)",
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
