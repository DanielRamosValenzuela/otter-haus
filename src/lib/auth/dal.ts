import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ADMIN_ID } from "@/lib/auth/credentials";
import { env } from "@/lib/env";
import type { AdminUser } from "@/lib/types/session";

export async function getCurrentAdmin(): Promise<AdminUser> {
  "use cache: private";

  const session = await getSession();
  if (!session.userId || session.userId !== ADMIN_ID) {
    redirect("/dashboard/login");
  }

  return { id: ADMIN_ID, name: env.ADMIN_NAME, email: env.ADMIN_EMAIL };
}

export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();
  if (!session.userId || session.userId !== ADMIN_ID) {
    throw new Error("No autorizado");
  }
  return { id: ADMIN_ID, name: env.ADMIN_NAME, email: env.ADMIN_EMAIL };
}
