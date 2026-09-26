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
  team_order: number | null;
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
    teamOrder: row.team_order ?? undefined,
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

export async function listFeaturedTeamMembers(): Promise<AccountProfile[]> {
  "use cache";
  cacheTag("team");
  cacheLife("hours");

  const rows = await sql`
    SELECT * FROM admin_accounts
    WHERE role = 'sub_admin' AND active = true AND team_order IS NOT NULL
    ORDER BY team_order ASC
  `;
  return (rows as AdminRow[]).map((row) => toProfile(rowToAccount(row)));
}

export async function setAccountTeamFeatured(id: string, featured: boolean): Promise<AccountProfile> {
  if (!featured) {
    const rows = await sql`
      UPDATE admin_accounts SET team_order = NULL WHERE id = ${id} AND role = 'sub_admin' RETURNING *
    `;
    if (rows.length === 0) throw new Error("Cuenta no encontrada.");
    return toProfile(rowToAccount(rows[0] as AdminRow));
  }

  const [{ next_order }] = await sql`
    SELECT COALESCE(MAX(team_order), -1) + 1 AS next_order FROM admin_accounts
  `;
  const rows = await sql`
    UPDATE admin_accounts SET team_order = ${next_order}
    WHERE id = ${id} AND role = 'sub_admin'
    RETURNING *
  `;
  if (rows.length === 0) throw new Error("Cuenta no encontrada.");
  return toProfile(rowToAccount(rows[0] as AdminRow));
}

export async function moveAccountTeamOrder(id: string, direction: "up" | "down"): Promise<void> {
  const featured = await sql`
    SELECT id, team_order FROM admin_accounts
    WHERE role = 'sub_admin' AND team_order IS NOT NULL
    ORDER BY team_order ASC
  `;
  const index = featured.findIndex((row) => (row as { id: string }).id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= featured.length) return;

  const current = featured[index] as { id: string; team_order: number };
  const swap = featured[swapIndex] as { id: string; team_order: number };

  await sql.transaction([
    sql`UPDATE admin_accounts SET team_order = ${swap.team_order} WHERE id = ${current.id}`,
    sql`UPDATE admin_accounts SET team_order = ${current.team_order} WHERE id = ${swap.id}`,
  ]);
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
