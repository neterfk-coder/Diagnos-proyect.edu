import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hoyISO,
  diasEntre,
  rachaVigente,
  tocarDia,
  semana,
  HITOS,
} from "../lib/racha-logica.js";

const base = { racha: 0, mejorRacha: 0, ultimoDia: null, dias: [] };

test("hoyISO usa la fecha local, no UTC", () => {
  // 1 de enero a las 23:00 locales: en UTC+X ya seria dia 2, y con UTC
  // el usuario perderia la racha antes de que acabe su dia.
  const f = new Date(2026, 0, 1, 23, 0, 0);
  assert.equal(hoyISO(f), "2026-01-01");
});

test("diasEntre cuenta dias naturales", () => {
  assert.equal(diasEntre("2026-07-28", "2026-07-29"), 1);
  assert.equal(diasEntre("2026-07-28", "2026-07-28"), 0);
  assert.equal(diasEntre("2026-07-31", "2026-08-01"), 1, "cruce de mes");
  assert.equal(diasEntre("2026-12-31", "2027-01-01"), 1, "cruce de año");
  assert.equal(diasEntre("2024-02-28", "2024-02-29"), 1, "año bisiesto");
});

test("la primera actividad empieza la racha en 1", () => {
  assert.equal(tocarDia(base, "2026-07-28").racha, 1);
});

test("repetir el mismo dia no sube la racha", () => {
  const uno = tocarDia(base, "2026-07-28");
  assert.equal(tocarDia(uno, "2026-07-28").racha, 1);
});

test("un dia consecutivo sube la racha", () => {
  const uno = tocarDia(base, "2026-07-28");
  assert.equal(tocarDia(uno, "2026-07-29").racha, 2);
});

test("saltarse un dia reinicia la racha", () => {
  const nueve = { ...base, racha: 9, mejorRacha: 9, ultimoDia: "2026-07-28" };
  assert.equal(tocarDia(nueve, "2026-07-30").racha, 1);
});

test("la mejor racha se conserva tras romperse", () => {
  const nueve = { ...base, racha: 9, mejorRacha: 9, ultimoDia: "2026-07-28" };
  assert.equal(tocarDia(nueve, "2026-07-30").mejorRacha, 9);
});

test("la racha sobrevive al cruce de mes y de año", () => {
  const finDeMes = { ...base, racha: 4, mejorRacha: 4, ultimoDia: "2026-07-31" };
  assert.equal(tocarDia(finDeMes, "2026-08-01").racha, 5);

  const finDeAnio = { ...base, racha: 6, mejorRacha: 6, ultimoDia: "2026-12-31" };
  assert.equal(tocarDia(finDeAnio, "2027-01-01").racha, 7);
});

test("tocarDia no muta el estado recibido", () => {
  const antes = { ...base, racha: 3, ultimoDia: "2026-07-28", dias: ["2026-07-28"] };
  const copia = JSON.parse(JSON.stringify(antes));
  tocarDia(antes, "2026-07-29");
  assert.deepEqual(antes, copia);
});

test("solo se guardan los ultimos 40 dias", () => {
  const muchos = { ...base, dias: Array.from({ length: 40 }, (_, i) => `d${i}`) };
  assert.equal(tocarDia(muchos, "2026-07-28").dias.length, 40);
});

test("la racha caduca si la ultima actividad no fue hoy ni ayer", () => {
  assert.equal(rachaVigente({ racha: 5, ultimoDia: "2026-07-28" }, "2026-07-28"), 5);
  assert.equal(rachaVigente({ racha: 5, ultimoDia: "2026-07-27" }, "2026-07-28"), 5);
  assert.equal(
    rachaVigente({ racha: 5, ultimoDia: "2026-07-26" }, "2026-07-28"),
    0,
    "anteayer ya no cuenta"
  );
  assert.equal(rachaVigente({ racha: 0, ultimoDia: null }, "2026-07-28"), 0);
});

test("semana devuelve siete dias terminando en el pedido", () => {
  const s = semana({ dias: ["2026-07-28", "2026-07-26"] }, "2026-07-28");
  assert.equal(s.length, 7);
  assert.equal(s[6].iso, "2026-07-28");
  assert.equal(s[6].esHoy, true);
  assert.equal(s[6].activo, true);
  assert.equal(s[4].iso, "2026-07-26");
  assert.equal(s[4].activo, true);
  assert.equal(s[5].activo, false);
});

test("los hitos estan ordenados y sin repetidos", () => {
  assert.deepEqual(HITOS, [...HITOS].sort((a, b) => a - b));
  assert.equal(new Set(HITOS).size, HITOS.length);
});
