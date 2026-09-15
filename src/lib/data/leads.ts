import "server-only";

import { sql } from "@/lib/data/db";
import type { Lead, LeadInput } from "@/lib/types/lead";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_id: string | null;
  property_slug: string | null;
  created_at: string;
}

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message,
    propertyId: row.property_id ?? undefined,
    propertySlug: row.property_slug ?? undefined,
    createdAt: row.created_at,
  };
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const id = `lead-${crypto.randomUUID()}`;
  const rows = await sql`
    INSERT INTO leads (id, name, email, phone, message, property_id, property_slug)
    VALUES (
      ${id}, ${input.name}, ${input.email}, ${input.phone ?? null}, ${input.message},
      ${input.propertyId ?? null}, ${input.propertySlug ?? null}
    )
    RETURNING *
  `;
  return rowToLead(rows[0] as LeadRow);
}

export async function listLeads(): Promise<Lead[]> {
  const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  return (rows as LeadRow[]).map(rowToLead);
}
