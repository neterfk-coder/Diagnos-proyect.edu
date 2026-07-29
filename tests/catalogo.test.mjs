import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CATALOGO,
  CODIGOS,
  REFERENCIAS,
  buscarPorCodigo,
  buscarReferencia,
  textoMisconception,
  catalogoParaPrompt,
} from "../lib/misconceptions.js";

test("los codigos son unicos", () => {
  assert.equal(new Set(CODIGOS).size, CODIGOS.length);
});

test("CODIGOS coincide con el catalogo", () => {
  assert.deepEqual(CODIGOS, CATALOGO.map((m) => m.codigo));
});

test("cada entrada tiene nombre y descripcion en los dos idiomas", () => {
  for (const m of CATALOGO) {
    for (const idioma of ["es", "en"]) {
      assert.ok(m[idioma]?.nombre, `${m.codigo} sin nombre en ${idioma}`);
      assert.ok(m[idioma]?.descripcion, `${m.codigo} sin descripcion en ${idioma}`);
    }
  }
});

test("textoMisconception cae al ingles si falta el idioma", () => {
  const m = CATALOGO[0];
  assert.equal(textoMisconception(m, "fr").nombre, m.en.nombre);
  assert.equal(textoMisconception(null, "es"), null);
});

test("buscarPorCodigo encuentra y devuelve null si no existe", () => {
  assert.equal(buscarPorCodigo("SIG-01")?.codigo, "SIG-01");
  assert.equal(buscarPorCodigo("NO-EXISTE"), null);
});

test("toda fuente citada existe en REFERENCIAS", () => {
  // Sin esto, una cita podria quedar huerfana al renombrar una referencia y
  // el catalogo mostraria una atribucion que no lleva a ninguna parte.
  for (const m of CATALOGO) {
    if (!m.fuente) continue;
    assert.ok(
      buscarReferencia(m.fuente),
      `${m.codigo} cita "${m.fuente}", que no esta en REFERENCIAS`
    );
  }
});

test("toda referencia se usa al menos una vez", () => {
  const usadas = new Set(CATALOGO.map((m) => m.fuente).filter(Boolean));
  for (const r of REFERENCIAS) {
    assert.ok(usadas.has(r.clave), `"${r.clave}" no la cita ninguna entrada`);
  }
});

test("las referencias llevan autor, año y publicacion", () => {
  for (const r of REFERENCIAS) {
    assert.match(r.cita, /\(\d{4}\)/, `"${r.clave}" sin año`);
    assert.ok(r.cita.length > 60, `"${r.clave}" demasiado escueta`);
  }
});

test("el prompt del catalogo incluye los doce codigos", () => {
  const prompt = catalogoParaPrompt("es");
  for (const c of CODIGOS) assert.ok(prompt.includes(c), `falta ${c}`);
});
