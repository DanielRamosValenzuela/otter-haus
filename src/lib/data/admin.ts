import "server-only";
import { readDb, writeDb } from "@/lib/data/json-store";
import type { AdminAccount } from "@/lib/types/admin";

export async function getAdmin(): Promise<AdminAccount> {
  const db = await readDb();
  if (!db.admin) {
    throw new Error(
      "No hay cuenta admin configurada. Corre: npm run create-admin -- <email> <nombre> <password>",
    );
  }
  return db.admin;
}

export async function updateAdminPassword(passwordHash: string): Promise<void> {
  await writeDb((db) => {
    if (!db.admin) throw new Error("No hay cuenta admin configurada.");
    return { ...db, admin: { ...db.admin, passwordHash } };
  });
}
