import { neon } from "@neondatabase/serverless";
import { existsSync, readFileSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envLocalPath = new URL("../.env.local", import.meta.url);
  if (existsSync(envLocalPath)) {
    const match = readFileSync(envLocalPath, "utf-8").match(/^DATABASE_URL=(.+)$/m);
    if (match) return match[1].trim();
  }
  throw new Error("Define DATABASE_URL (variable de entorno o .env.local).");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const [email, name, password] = process.argv.slice(2);
if (!email || !name || !password) {
  console.error("Uso: npm run create-admin -- <email> <nombre> <password>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("La contraseña debe tener al menos 8 caracteres.");
  process.exit(1);
}

const sql = neon(loadDatabaseUrl());
await sql`
  CREATE TABLE IF NOT EXISTS app_state (
    id INT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

const rows = await sql`SELECT data FROM app_state WHERE id = 1`;
if (rows.length === 0) {
  console.error(
    "Todavía no existe la fila principal de datos. Corre 'npm run dev' una vez (para sembrar el contenido inicial) y vuelve a correr este script.",
  );
  process.exit(1);
}

const admin = { id: "admin-tranhaus", email, name, passwordHash: hashPassword(password) };
await sql`
  UPDATE app_state
  SET data = jsonb_set(data, '{admin}', ${JSON.stringify(admin)}::jsonb), updated_at = now()
  WHERE id = 1
`;

console.log(`Cuenta admin configurada: ${email}`);
