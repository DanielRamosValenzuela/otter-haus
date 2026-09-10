import "server-only";
import { z } from "zod";

// Only this module (and the auth layer, which imports from here) reads
// `process.env` directly — everything else imports `env` from here, so a
// missing/invalid var fails loudly at first use instead of silently at
// login time. See docs/04-tecnico.md (data-security guidance).
const envSchema = z.object({
  SESSION_PASSWORD: z
    .string()
    .min(32, "SESSION_PASSWORD debe tener al menos 32 caracteres (iron-session lo exige)."),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_NAME: z.string().min(1),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(/^[a-f0-9]+:[a-f0-9]+$/i, "Formato esperado: salt:hash (ver scripts/hash-password.mjs)."),
  TRANHAUS_DATA_DIR: z.string().optional(),
  // Coerce "" to undefined first — Vercel lets an env var exist but be
  // left blank, which `.default()` alone doesn't catch (it only applies
  // to `undefined`), and that blank value would otherwise fail `.url()`.
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().url().default("http://localhost:3000"),
  ),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Variables de entorno inválidas o faltantes:\n${issues}\n\nRevisa .env.example y copia los valores a .env.local (usa "npm run hash-password -- <password>" para ADMIN_PASSWORD_HASH).`,
    );
  }
  return parsed.data;
}

export const env = loadEnv();
