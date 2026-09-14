import "server-only";
import { z } from "zod";

const envSchema = z.object({
  SESSION_PASSWORD: z
    .string()
    .trim()
    .min(32, "SESSION_PASSWORD debe tener al menos 32 caracteres (iron-session lo exige)."),
  DATABASE_URL: z
    .string()
    .trim()
    .regex(/^postgres(ql)?:\/\//, "Debe ser una connection string de Postgres (postgresql://...)."),
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .trim()
    .regex(/^vercel_blob_rw_/, "Debe ser un token de Vercel Blob (vercel_blob_rw_...)."),
  NEXT_PUBLIC_SITE_URL: z.preprocess((value) => {
    if (typeof value !== "string" || value.trim() === "") return undefined;
    try {
      new URL(value);
      return value;
    } catch {
      try {
        new URL(`https://${value}`);
        return `https://${value}`;
      } catch {
        return value;
      }
    }
  }, z.string().url().default("http://localhost:3000")),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Variables de entorno inválidas o faltantes:\n${issues}\n\nRevisa .env.example y copia los valores a .env.local.`,
    );
  }
  return parsed.data;
}

export const env = loadEnv();
