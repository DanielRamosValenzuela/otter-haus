import "server-only";
import { createHash, randomBytes } from "node:crypto";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function resetTokenExpiry(): Date {
  return new Date(Date.now() + RESET_TOKEN_TTL_MS);
}
