import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "@/lib/data/db";
import { slugify } from "@/lib/utils/format";
import type { AccountProfile, AdminAccount, ProfileInput, SubAdminInput } from "@/lib/types/admin";

interface AdminRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: AdminAccount["role"];
  active: boolean;
  slug: string | null;
  role_title: string | null;
  photo_url: string | null;
  bio: string | null;
  created_at: string;
}

function rowToAccount(row: AdminRow): AdminAccount {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    role: row.role,
    active: row.active,
    slug: row.slug ?? undefined,
    roleTitle: row.role_title ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    bio: row.bio ?? undefined,
    createdAt: row.created_at,
  };
}

function toProfile(account: AdminAccount): AccountProfile {
  const { passwordHash: _passwordHash, ...profile } = account;
  return profile;
}

export async function getAccountByEmail(email: string): Promise<AdminAccount | null> {
  const rows = await sql`
    SELECT * FROM admin_accounts WHERE lower(email) = lower(${email}) LIMIT 1
  `;
  return rows.length > 0 ? rowToAccount(rows[0] as AdminRow) : null;
}

export async function getAccountById(id: string): Promise<AdminAccount | null> {
  const rows = await sql`SELECT * FROM admin_accounts WHERE id = ${id} LIMIT 1`;
  return rows.length > 0 ? rowToAccount(rows[0] as AdminRow) : null;
}

export async function getAccountProfile(id: string): Promise<AccountProfile | null> {
  const account = await getAccountById(id);
  return account ? toProfile(account) : null;
}

export async function getSubAdminBySlug(slug: string): Promise<AccountProfile | null> {
  "use cache";
  cacheTag("team");
  cacheTag(`team:${slug}`);
  cacheLife("hours");

  const rows = await sql`
    SELECT * FROM admin_accounts WHERE slug = ${slug} AND role = 'sub_admin' AND active = true LIMIT 1
  `;
  return rows.length > 0 ? toProfile(rowToAccount(rows[0] as AdminRow)) : null;
}

export async function listSubAdmins(): Promise<AccountProfile[]> {
  const rows = await sql`
    SELECT * FROM admin_accounts WHERE role = 'sub_admin' ORDER BY created_at DESC
  `;
  return (rows as AdminRow[]).map((row) => toProfile(rowToAccount(row)));
}

async function uniqueAccountSlug(base: string): Promise<string> {
  const root = slugify(base) || "usuario";
  let candidate = root;
  let n = 2;
  for (;;) {
    const rows = await sql`SELECT 1 FROM admin_accounts WHERE slug = ${candidate}`;
    if (rows.length === 0) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

export async function createSubAdmin(
  input: SubAdminInput,
  passwordHash: string,
): Promise<AccountProfile> {
  const id = `account-${crypto.randomUUID()}`;
  const slug = await uniqueAccountSlug(input.name);

  const rows = await sql`
    INSERT INTO admin_accounts (id, email, name, password_hash, role, active, slug, role_title)
    VALUES (${id}, ${input.email}, ${input.name}, ${passwordHash}, 'sub_admin', true, ${slug}, ${input.roleTitle ?? null})
    RETURNING *
  `;
  return toProfile(rowToAccount(rows[0] as AdminRow));
}

export async function setAccountActive(id: string, active: boolean): Promise<void> {
  const rows = await sql`
    UPDATE admin_accounts SET active = ${active} WHERE id = ${id} AND role = 'sub_admin' RETURNING id
  `;
  if (rows.length === 0) throw new Error("Cuenta no encontrada.");
}

export async function updateAccountProfile(id: string, input: ProfileInput): Promise<AccountProfile> {
  const rows = await sql`
    UPDATE admin_accounts SET
      name = ${input.name},
      role_title = ${input.roleTitle ?? null},
      photo_url = ${input.photoUrl ?? null},
      bio = ${input.bio ?? null}
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) throw new Error("Cuenta no encontrada.");
  return toProfile(rowToAccount(rows[0] as AdminRow));
}

export async function updateAdminPassword(id: string, passwordHash: string): Promise<void> {
  const rows = await sql`
    UPDATE admin_accounts SET password_hash = ${passwordHash} WHERE id = ${id} RETURNING id
  `;
  if (rows.length === 0) throw new Error("Cuenta no encontrada.");
}
