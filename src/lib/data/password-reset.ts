import "server-only";
import { sql } from "@/lib/data/db";

export async function createPasswordResetToken(
  accountId: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  const id = `reset-${crypto.randomUUID()}`;
  await sql`
    INSERT INTO password_reset_tokens (id, account_id, token_hash, expires_at)
    VALUES (${id}, ${accountId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;
}

export async function consumePasswordResetToken(tokenHash: string): Promise<{ accountId: string } | null> {
  const rows = await sql`
    UPDATE password_reset_tokens
    SET used_at = now()
    WHERE token_hash = ${tokenHash} AND used_at IS NULL AND expires_at > now()
    RETURNING account_id
  `;
  return rows.length > 0 ? { accountId: rows[0].account_id as string } : null;
}

export async function deleteExpiredPasswordResetTokens(): Promise<void> {
  await sql`DELETE FROM password_reset_tokens WHERE expires_at < now()`;
}
