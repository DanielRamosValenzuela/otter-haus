import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAccountById } from "@/lib/data/admin";
import type { AdminUser } from "@/lib/types/session";

export async function tryGetAccount(): Promise<AdminUser | null> {
  const session = await getSession();
  if (!session.userId) return null;
  const account = await getAccountById(session.userId);
  if (!account || !account.active) return null;
  return { id: account.id, name: account.name, email: account.email, role: account.role };
}

export async function getCurrentAccount(): Promise<AdminUser> {
  "use cache: private";

  const account = await tryGetAccount();
  if (!account) redirect("/dashboard/login");
  return account;
}

export async function requireAdminPage(): Promise<AdminUser> {
  "use cache: private";

  const account = await tryGetAccount();
  if (!account) redirect("/dashboard/login");
  if (account.role !== "admin") redirect("/dashboard/propiedades");
  return account;
}

export async function requireAuth(): Promise<AdminUser> {
  const account = await tryGetAccount();
  if (!account) throw new Error("No autorizado");
  return account;
}

export async function requireAdmin(): Promise<AdminUser> {
  const account = await requireAuth();
  if (account.role !== "admin") throw new Error("No autorizado");
  return account;
}
