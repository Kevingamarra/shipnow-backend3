import fs from "node:fs";
import { config as loadEnv } from "dotenv";

const envFile = ".env.test";
const templateFile = ".env.test.example";

if (!fs.existsSync(envFile)) {
  if (!fs.existsSync(templateFile)) {
    console.error("ERROR: falta .env.test.example");
    process.exit(1);
  }

  fs.copyFileSync(templateFile, envFile);
  console.log("Se creó .env.test desde .env.test.example");
}

const env = loadEnv({
  path: envFile,
  processEnv: {}
}).parsed ?? {};

const required = [
  "NODE_ENV",
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN"
];

const missing = required.filter(
  key => !env[key] || env[key].startsWith("REEMPLAZAR_") ||
    env[key].startsWith("reemplazar_")
);

if (missing.length) {
  console.error(
    "ERROR: configurá estas variables en .env.test: " +
    missing.join(", ")
  );
  console.error(
    "Usá una conexión MongoDB exclusiva para testing."
  );
  process.exit(1);
}

if (env.NODE_ENV !== "test") {
  console.error("SEGURIDAD: NODE_ENV debe ser test");
  process.exit(1);
}

let uri;

try {
  uri = new URL(env.MONGODB_URI);
} catch {
  console.error("ERROR: MONGODB_URI no es una URL válida");
  process.exit(1);
}

if (uri.pathname !== "/shipnow_test") {
  console.error(
    "SEGURIDAD: MONGODB_URI debe apuntar a /shipnow_test"
  );
  process.exit(1);
}

console.log("Entorno de testing verificado correctamente.");
