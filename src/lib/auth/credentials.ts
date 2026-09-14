import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getAdmin } from "@/lib/data/admin";
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

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
  const [salt, hashHex] = storedHash.split(":");
  const hash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(hashHex, "hex");
  if (hash.length !== storedHashBuffer.length) return false;
  return timingSafeEqual(hash, storedHashBuffer);
}

export async function verifyCredentials(
  email: string,
  password: string,
  throttleKey = email,
): Promise<AdminUser | null> {
  if (isThrottled(throttleKey)) return null;

  const admin = await getAdmin();
  const validEmail = safeEqualStrings(email.trim().toLowerCase(), admin.email.toLowerCase());
  const validPassword = verifyPasswordHash(password, admin.passwordHash);

  if (!validEmail || !validPassword) {
    recordFailure(throttleKey);
    return null;
  }

  return { id: admin.id, name: admin.name, email: admin.email };
}

export { ADMIN_ID };
