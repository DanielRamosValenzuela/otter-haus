import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ADMIN_ID } from "@/lib/auth/credentials";
import { env } from "@/lib/env";
import type { AdminUser } from "@/lib/types/session";

/**
 * For rendering: reads the session behind a private cache scope so
 * authenticated navigations can still be prefetched. Redirects (which
 * throw) are never cached — only a resolved admin is. Must be called
 * from inside a <Suspense> boundary (see (dashboard)/dashboard/layout.tsx).
 */
export async function getCurrentAdmin(): Promise<AdminUser> {
  "use cache: private";

  const session = await getSession();
  if (!session.userId || session.userId !== ADMIN_ID) {
    redirect("/dashboard/login");
  }

  return { id: ADMIN_ID, name: env.ADMIN_NAME, email: env.ADMIN_EMAIL };
}

/**
 * For Server Actions and mutations: re-reads the raw request cookie
 * directly (not the private cache) so every write re-authorizes itself,
 * per Next's guidance to never trust the proxy or a cached read for
 * authorization. Throws instead of redirecting — Server Actions aren't
 * navigations.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();
  if (!session.userId || session.userId !== ADMIN_ID) {
    throw new Error("No autorizado");
  }
  return { id: ADMIN_ID, name: env.ADMIN_NAME, email: env.ADMIN_EMAIL };
}
