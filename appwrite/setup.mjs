/**
 * ============================================================
 * Diagnos · Provisionamiento de la base de datos en Appwrite
 * ============================================================
 *
 * Appwrite no usa SQL: la tabla, sus columnas, sus índices y sus permisos
 * se crean por API. Este script sustituye al antiguo schema.sql.
 *
 * Usa la API TablesDB (Appwrite 1.8+). La antigua API `Databases`
 * (colecciones/documentos) está deprecada.
 *
 * Uso (Node 20+):
 *   npm run setup:appwrite
 *
 * Es idempotente: si algo ya existe, lo salta y continúa.
 */

import {
  Client,
  TablesDB,
  ID,
  Permission,
  Role,
  TablesDBIndexType,
} from "node-appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROYECTO = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const CLAVE = process.env.APPWRITE_API_KEY;
const BASE_DATOS = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "diagnos";
const TABLA = process.env.NEXT_PUBLIC_APPWRITE_TABLE_DIAGNOSTICOS || "diagnosticos";
const TABLA_MENSAJES = process.env.APPWRITE_TABLE_MENSAJES || "mensajes";

if (!ENDPOINT || !PROYECTO || !CLAVE) {
  console.error(
    "Faltan variables de entorno. Copia .env.example a .env.local y rellena\n" +
      "NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID y APPWRITE_API_KEY."
  );
  process.exit(1);
}

const bd = new TablesDB(
  new Client().setEndpoint(ENDPOINT).setProject(PROYECTO).setKey(CLAVE)
);

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ejecuta una operación y la ignora si el recurso ya existía (409). */
async function crear(descripcion, operacion) {
  try {
    await operacion();
    console.log(`  ✓ ${descripcion}`);
  } catch (error) {
    if (error?.code === 409) {
      console.log(`  · ${descripcion} (ya existía)`);
      return;
    }
    throw error;
  }
}

/**
 * Appwrite crea las columnas de forma asíncrona: quedan en estado
 * "processing" un rato. Indexar antes de que estén "available" falla,
 * así que sondeamos en vez de dormir un tiempo fijo a ojo.
 */
async function esperarColumnas(intentos = 20) {
  for (let i = 0; i < intentos; i++) {
    const { columns } = await bd.listColumns({
      databaseId: BASE_DATOS,
      tableId: TABLA,
    });
    const pendientes = columns.filter((c) => c.status !== "available");
    if (pendientes.length === 0) {
      console.log(`  ✓ ${columns.length} columnas disponibles`);
      return;
    }
    console.log(
      `  · esperando ${pendientes.length} columna(s): ${pendientes
        .map((c) => c.key)
        .join(", ")}`
    );
    await esperar(1500);
  }
  throw new Error(
    "Las columnas siguen sin estar disponibles. Revisa el panel de Appwrite y vuelve a ejecutar el script."
  );
}

async function main() {
  console.log(`\nProyecto ${PROYECTO} · base de datos "${BASE_DATOS}"\n`);

  console.log("Base de datos:");
  // Se comprueba antes de crear en vez de confiar en el 409: cuando el plan
  // ya está al límite de bases de datos, Appwrite responde con un error de
  // cuota y no con un conflicto, y el script dejaba de ser idempotente.
  let existeBase = false;
  try {
    await bd.get({ databaseId: BASE_DATOS });
    existeBase = true;
    console.log(`  · base de datos "${BASE_DATOS}" (ya existía)`);
  } catch {
    existeBase = false;
  }

  if (!existeBase) {
    await crear(`base de datos "${BASE_DATOS}"`, () =>
      bd.create({ databaseId: BASE_DATOS, name: "Diagnos" })
    );
  }

  console.log("\nTabla:");
  // Sin permisos de cliente: el navegador no toca la base de datos. Tanto la
  // escritura de diagnósticos como la lectura del panel docente pasan por
  // rutas de API que usan la API key, que omite estos permisos.
  await crear(`tabla "${TABLA}"`, () =>
    bd.createTable({
      databaseId: BASE_DATOS,
      tableId: TABLA,
      name: "Diagnósticos",
      permissions: [],
      rowSecurity: false,
    })
  );

  // Se usa varchar (no text): createStringColumn está deprecada desde 1.9.0,
  // y las columnas TEXT necesitan longitud de prefijo para poder indexarse,
  // que es justo lo que hace falta en "misconception".
  console.log("\nColumnas:");
  await crear("ejercicio (varchar 512, requerida)", () =>
    bd.createVarcharColumn({
      databaseId: BASE_DATOS,
      tableId: TABLA,
      key: "ejercicio",
      size: 512,
      required: true,
    })
  );
  await crear("misconception (varchar 16, requerida)", () =>
    bd.createVarcharColumn({
      databaseId: BASE_DATOS,
      tableId: TABLA,
      key: "misconception",
      size: 16,
      required: true,
    })
  );
  await crear("paso_roto (integer, opcional)", () =>
    bd.createIntegerColumn({
      databaseId: BASE_DATOS,
      tableId: TABLA,
      key: "paso_roto",
      required: false,
      min: 0,
      max: 999,
    })
  );
  await crear("aula (varchar 64, opcional, default 'demo')", () =>
    bd.createVarcharColumn({
      databaseId: BASE_DATOS,
      tableId: TABLA,
      key: "aula",
      size: 64,
      required: false,
      xdefault: "demo",
    })
  );

  // Las columnas se procesan de forma asíncrona en el servidor: hay que
  // esperar a que estén "available" antes de poder indexarlas.
  console.log("\nEsperando a que las columnas estén disponibles…");
  await esperarColumnas();

  console.log("\nÍndices:");
  await crear("idx_misconception", () =>
    bd.createIndex({
      databaseId: BASE_DATOS,
      tableId: TABLA,
      key: "idx_misconception",
      type: TablesDBIndexType.Key,
      columns: ["misconception"],
    })
  );
  // No hace falta índice de fecha: Appwrite indexa $createdAt por defecto.

  // ---------------- Mensajes del formulario de contacto ----------------
  console.log("\nTabla de mensajes:");
  await crear(`tabla "${TABLA_MENSAJES}"`, () =>
    bd.createTable({
      databaseId: BASE_DATOS,
      tableId: TABLA_MENSAJES,
      name: "Mensajes de contacto",
      permissions: [], // solo servidor: nadie debe poder leer el buzón
      rowSecurity: false,
    })
  );

  const columnasMensaje = [
    ["nombre", 120, true],
    ["correo", 160, true],
    ["asunto", 200, true],
    ["mensaje", 4000, true],
    ["idioma", 8, false],
  ];
  for (const [clave, tamano, requerida] of columnasMensaje) {
    await crear(`${clave} (varchar ${tamano})`, () =>
      bd.createVarcharColumn({
        databaseId: BASE_DATOS,
        tableId: TABLA_MENSAJES,
        key: clave,
        size: tamano,
        required: requerida,
      })
    );
  }

  console.log("\nDatos de ejemplo para la demo del panel docente:");
  const ejemplos = [
    ["3x + 5 = 20", "SIG-01", 2],
    ["2(x − 4) = 10", "SIG-02", 1],
    ["5x − 3 = 12", "SIG-01", 2],
    ["x/3 + 2 = 7", "EQU-01", 2],
    ["4x + 1 = 2x + 9", "SIG-01", 2],
    ["(x + 3)/3 = 5", "FRA-01", 1],
    ["2x + 3x² = ?", "VAR-02", 1],
    ["−(x + 6) = 4", "SIG-02", 1],
    ["7 = 3 + 2x", "EQU-02", 2],
    ["3x = 15", "OTr-00", 2],
  ];

  const { total } = await bd.listRows({
    databaseId: BASE_DATOS,
    tableId: TABLA,
  });

  if (total > 0) {
    console.log(`  · ya hay ${total} filas, no se siembra nada`);
  } else {
    for (const [ejercicio, misconception, paso_roto] of ejemplos) {
      await bd.createRow({
        databaseId: BASE_DATOS,
        tableId: TABLA,
        rowId: ID.unique(),
        data: { ejercicio, misconception, paso_roto, aula: "demo" },
      });
    }
    console.log(`  ✓ ${ejemplos.length} diagnósticos de ejemplo`);
  }

  console.log("\nListo. El panel docente ya puede leer datos en vivo.\n");
}

main().catch((error) => {
  console.error("\nFalló el provisionamiento:", error?.message || error);
  process.exit(1);
});
