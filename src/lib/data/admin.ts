import "server-only";
import { sql } from "@/lib/data/db";
import type { AdminAccount } from "@/lib/types/admin";

interface AdminRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
}

function rowToAdmin(row: AdminRow): AdminAccount {
  return { id: row.id, email: row.email, name: row.name, passwordHash: row.password_hash };
}

export async function getAdmin(): Promise<AdminAccount> {
  const rows = await sql`SELECT * FROM admin_accounts LIMIT 1`;
  if (rows.length === 0) {
    throw new Error("No hay cuenta admin configurada.");
  }
  return rowToAdmin(rows[0] as AdminRow);
}

export async function updateAdminPassword(passwordHash: string): Promise<void> {
  const rows = await sql`
    UPDATE admin_accounts SET password_hash = ${passwordHash}
    RETURNING id
  `;
  if (rows.length === 0) throw new Error("No hay cuenta admin configurada.");
}
