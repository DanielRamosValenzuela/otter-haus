import "server-only";

import { readDb, writeDb } from "@/lib/data/json-store";
import type { Lead, LeadInput } from "@/lib/types/lead";

export async function createLead(input: LeadInput): Promise<Lead> {
  let created!: Lead;
  await writeDb((db) => {
    created = {
      ...input,
      id: `lead-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    return { ...db, leads: [...db.leads, created] };
  });
  return created;
}

// Uncached — dashboard-only, read-your-own-writes.
export async function listLeads(): Promise<Lead[]> {
  const db = await readDb();
  return [...db.leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
