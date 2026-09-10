import "server-only";
import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";
import { env } from "@/lib/env";
import type { SessionData } from "@/lib/types/session";

const COOKIE_NAME = "tranhaus_session";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Raw session reader — no cache directive. Server Actions call this
 * directly (not the "use cache: private" DAL) so they always re-verify
 * against the actual request cookie rather than trusting a cached read.
 */
export async function getSession(): Promise<SessionData> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return {};
  try {
    return await unsealData<SessionData>(cookie, { password: env.SESSION_PASSWORD });
  } catch {
    // Expired or tampered cookie — treat as logged out rather than throwing.
    return {};
  }
}

export async function createSession(data: SessionData): Promise<void> {
  const sealed = await sealData(
    { ...data, loggedInAt: Date.now() },
    { password: env.SESSION_PASSWORD, ttl: TTL_SECONDS },
  );
  (await cookies()).set(COOKIE_NAME, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
