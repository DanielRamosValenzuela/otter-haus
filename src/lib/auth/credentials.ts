import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getAccountByEmail } from "@/lib/data/admin";
import type { AdminUser } from "@/lib/types/session";

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

const DUMMY_HASH = hashPassword(randomBytes(24).toString("hex"));

export async function verifyCredentials(
  email: string,
  password: string,
  throttleKey = email,
): Promise<AdminUser | null> {
  if (isThrottled(throttleKey)) return null;

  const account = await getAccountByEmail(email.trim());
  const validPassword = verifyPasswordHash(password, account?.passwordHash ?? DUMMY_HASH);

  if (!account || !account.active || !validPassword) {
    recordFailure(throttleKey);
    return null;
  }

  return { id: account.id, name: account.name, email: account.email, role: account.role };
}
