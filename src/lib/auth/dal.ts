import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ADMIN_ID } from "@/lib/auth/credentials";
import { getAdmin } from "@/lib/data/admin";
import type { AdminUser } from "@/lib/types/session";

export async function getCurrentAdmin(): Promise<AdminUser> {
  "use cache: private";

  const session = await getSession();
  if (!session.userId || session.userId !== ADMIN_ID) {
    redirect("/dashboard/login");
  }

  const admin = await getAdmin();
  return { id: admin.id, name: admin.name, email: admin.email };
}

export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();
  if (!session.userId || session.userId !== ADMIN_ID) {
    throw new Error("No autorizado");
  }
  const admin = await getAdmin();
  return { id: admin.id, name: admin.name, email: admin.email };
}
