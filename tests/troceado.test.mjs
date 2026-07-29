import { test } from "node:test";
import assert from "node:assert/strict";
import { trocear } from "../lib/troceado.js";

test("un texto corto no se trocea", () => {
  assert.deepEqual(trocear("hola", 100), ["hola"]);
});

test("un texto vacio no produce trozos", () => {
  assert.deepEqual(trocear("", 100), []);
  assert.deepEqual(trocear("   ", 100), []);
  assert.deepEqual(trocear(null, 100), []);
});

test("ningun trozo excede el tamaño pedido", () => {
  const texto = "palabra ".repeat(4000);
  for (const trozo of trocear(texto, 1000)) {
    assert.ok(trozo.length <= 1000, `trozo de ${trozo.length}`);
  }
});

test("no se pierde contenido al trocear", () => {
  // Se comparan las palabras: los cortes recortan espacios en los bordes.
  const texto = Array.from({ length: 900 }, (_, i) => `p${i}`).join(" ");
  const juntas = trocear(texto, 500).join(" ");
  assert.deepEqual(juntas.split(/\s+/), texto.split(/\s+/));
});

test("corta por el salto de parrafo cuando hay uno cerca", () => {
  const texto = "A".repeat(880) + "\n\n" + "B".repeat(400);
  const trozos = trocear(texto, 1000);
  assert.equal(trozos.length, 2);
  assert.ok(
    /^A+$/.test(trozos[0]),
    "el primer trozo debe acabar en el parrafo, sin arrastrar B"
  );
});

test("corta por fin de frase si no hay parrafo", () => {
  const texto = "A".repeat(870) + ". " + "B".repeat(400);
  const trozos = trocear(texto, 1000);
  assert.equal(trozos.length, 2);
  assert.ok(trozos[0].endsWith("."), "debe cerrar la frase");
});

test("nunca corta a mitad de palabra si hay separador en la ventana", () => {
  // Un texto de un solo parrafo largo no tiene saltos ni puntos, asi que el
  // unico corte limpio posible es el espacio. Se comprueba que la primera y
  // la ultima palabra de cada trozo sean palabras completas del vocabulario.
  const vocabulario = ["lorem", "ipsum", "dolor", "sit", "amet"];
  const texto = (vocabulario.join(" ") + " ").repeat(200);

  for (const trozo of trocear(texto, 900)) {
    const palabras = trozo.split(/\s+/);
    assert.ok(
      vocabulario.includes(palabras[0]),
      `el trozo empieza a mitad de palabra: "${palabras[0]}"`
    );
    assert.ok(
      vocabulario.includes(palabras[palabras.length - 1]),
      `el trozo acaba a mitad de palabra: "${palabras[palabras.length - 1]}"`
    );
  }
});

test("un texto sin separadores se sigue troceando", () => {
  // Caso limite: sin espacios ni puntos no hay corte limpio posible, pero
  // no debe entrar en bucle ni perder caracteres.
  const texto = "X".repeat(2500);
  const trozos = trocear(texto, 1000);
  assert.ok(trozos.length >= 3);
  assert.equal(trozos.join("").length, 2500);
});
