import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import type { AdminUser } from "@/lib/types/session";

const ADMIN_ID = "admin-tranhaus";

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isThrottled(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function verifyPassword(password: string): boolean {
  const [salt, storedHash] = env.ADMIN_PASSWORD_HASH.split(":");
  const hash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");
  if (hash.length !== storedHashBuffer.length) return false;
  return timingSafeEqual(hash, storedHashBuffer);
}

export async function verifyCredentials(
  email: string,
  password: string,
  throttleKey = email,
): Promise<AdminUser | null> {
  if (isThrottled(throttleKey)) return null;

  const validEmail = safeEqualStrings(email.trim().toLowerCase(), env.ADMIN_EMAIL.toLowerCase());
  const validPassword = verifyPassword(password);

  if (!validEmail || !validPassword) {
    recordFailure(throttleKey);
    return null;
  }

  return { id: ADMIN_ID, name: env.ADMIN_NAME, email: env.ADMIN_EMAIL };
}

export { ADMIN_ID };
