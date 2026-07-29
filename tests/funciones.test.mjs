import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FUNCIONES,
  buscarFuncion,
  evaluar,
  formula,
  muestrear,
  asintotas,
  marcasX,
} from "../lib/funciones.js";

const P = Math.PI;
const TRIG = { xMin: -2 * P, xMax: 2 * P, yMin: -4, yMax: 4 };
const ALG = { xMin: -8, xMax: 8, yMin: -6, yMax: 6 };
const NEUTRO = { a: 1, b: 1, c: 0, d: 0 };

test("evaluar aplica a·f(b·x + c) + d", () => {
  const sen = buscarFuncion("sin");
  assert.ok(Math.abs(evaluar(sen, 0, NEUTRO)) < 1e-9);
  // 2·sen(0 + π/2) + 1 = 3
  assert.ok(Math.abs(evaluar(sen, 0, { a: 2, b: 1, c: P / 2, d: 1 }) - 3) < 1e-9);
});

test("la formula omite los terminos neutros", () => {
  const tan = buscarFuncion("tan");
  assert.equal(formula(tan, NEUTRO, "tan"), "y = tan(x)");
});

test("la formula recoge los parametros no neutros", () => {
  const tan = buscarFuncion("tan");
  const f = formula(tan, { a: 2, b: 3, c: 1, d: -1 }, "tan");
  assert.equal(f, "y = 2·tan(3x + 1) − 1");
});

test("la lineal se escribe sin parentesis", () => {
  const lineal = buscarFuncion("lineal");
  assert.equal(formula(lineal, { a: 1, b: 2, c: 1, d: 0 }, "x"), "y = 2x + 1");
});

test("asintotas de la tangente en ±π/2 y ±3π/2", () => {
  const encontradas = asintotas(buscarFuncion("tan"), NEUTRO, TRIG).filter(
    (x) => x > TRIG.xMin + 0.1 && x < TRIG.xMax - 0.1
  );
  const esperadas = [-3 * P / 2, -P / 2, P / 2, 3 * P / 2];
  assert.equal(encontradas.length, esperadas.length);
  for (const e of esperadas) {
    assert.ok(
      encontradas.some((a) => Math.abs(a - e) < 0.05),
      `falta la asintota en ${e.toFixed(2)}`
    );
  }
});

test("asintotas de la cosecante en −π, 0 y π", () => {
  // Este es el caso que fallaba al detectarlas por cambio de signo: cuando
  // el muestreo cae justo sobre el infinito no hay dos valores finitos.
  const encontradas = asintotas(buscarFuncion("csc"), NEUTRO, TRIG).filter(
    (x) => x > TRIG.xMin + 0.1 && x < TRIG.xMax - 0.1
  );
  assert.equal(encontradas.length, 3);
  for (const e of [-P, 0, P]) {
    assert.ok(encontradas.some((a) => Math.abs(a - e) < 0.05));
  }
});

test("1/x tiene una asintota en cero", () => {
  const encontradas = asintotas(buscarFuncion("inversa"), NEUTRO, ALG);
  assert.equal(encontradas.length, 1);
  assert.ok(Math.abs(encontradas[0]) < 0.05);
});

test("ningun tramo cruza una asintota", () => {
  // Un solo trazo continuo uniria las ramas de la tangente con una recta
  // vertical falsa que atraviesa la grafica entera.
  for (const id of ["tan", "sec", "csc", "cot", "inversa"]) {
    const f = buscarFuncion(id);
    const vista = id === "inversa" ? ALG : TRIG;
    const tramos = muestrear(f, NEUTRO, vista);
    const asint = asintotas(f, NEUTRO, vista);

    for (const tramo of tramos) {
      for (const a of asint) {
        const antes = tramo.some(([x]) => x < a - 0.02);
        const despues = tramo.some(([x]) => x > a + 0.02);
        assert.ok(!(antes && despues), `${id}: un tramo cruza la asintota en ${a}`);
      }
    }
  }
});

test("las funciones continuas dan un solo tramo", () => {
  for (const id of ["sin", "cos", "cuadratica", "absoluto"]) {
    const tramos = muestrear(buscarFuncion(id), NEUTRO, TRIG);
    assert.equal(tramos.length, 1, `${id} deberia ser continua`);
  }
});

test("la raiz y el logaritmo no se dibujan donde no existen", () => {
  for (const id of ["raiz", "logaritmo"]) {
    const tramos = muestrear(buscarFuncion(id), NEUTRO, ALG);
    for (const tramo of tramos) {
      for (const [x] of tramo) {
        assert.ok(x >= -0.02, `${id} dibujado en x=${x.toFixed(2)}`);
      }
    }
  }
});

test("las marcas trigonometricas van en multiplos de π/2", () => {
  const marcas = marcasX(buscarFuncion("sin"), TRIG);
  assert.ok(marcas.length > 0);
  for (const m of marcas) {
    assert.ok(Math.abs((m.x % (P / 2)) / (P / 2)) < 1e-6 || Math.abs(m.x % (P / 2)) < 1e-6);
    assert.match(m.texto, /π/);
  }
});

test("buscarFuncion cae en la primera si el id no existe", () => {
  assert.equal(buscarFuncion("no-existe"), FUNCIONES[0]);
});
