import "server-only";
import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";
import { env } from "@/lib/env";
import type { SessionData } from "@/lib/types/session";

const COOKIE_NAME = "tranhaus_session";
const TTL_SECONDS = 60 * 60 * 24 * 7;

export async function getSession(): Promise<SessionData> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return {};
  try {
    return await unsealData<SessionData>(cookie, { password: env.SESSION_PASSWORD });
  } catch {
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
