import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import type { Agent, AgentInput } from "@/lib/types/agent";

interface AgentRow {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  bio: string;
  short_bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsapp_message: string;
  notification_email: string;
  coverage_zones: string[];
  credentials: string[];
  stats: Agent["stats"];
  socials: Agent["socials"];
  updated_at: string;
}

function rowToAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photoUrl: row.photo_url,
    bio: row.bio,
    shortBio: row.short_bio,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    whatsappMessage: row.whatsapp_message,
    notificationEmail: row.notification_email,
    coverageZones: row.coverage_zones,
    credentials: row.credentials,
    stats: row.stats,
    socials: row.socials,
    updatedAt: row.updated_at,
  };
}

export async function getAgent(): Promise<Agent> {
  "use cache";
  cacheTag("agent");
  cacheLife("days");

  const rows = await sql`SELECT * FROM agent LIMIT 1`;
  if (rows.length === 0) throw new Error("No hay perfil de agente configurado.");
  return rowToAgent(rows[0] as AgentRow);
}

export async function updateAgent(input: AgentInput): Promise<Agent> {
  const rows = await sql`
    UPDATE agent SET
      name = ${input.name},
      role = ${input.role},
      photo_url = ${input.photoUrl},
      bio = ${input.bio},
      short_bio = ${input.shortBio},
      email = ${input.email},
      phone = ${input.phone},
      whatsapp = ${input.whatsapp},
      whatsapp_message = ${input.whatsappMessage},
      notification_email = ${input.notificationEmail},
      coverage_zones = ${JSON.stringify(input.coverageZones)}::jsonb,
      credentials = ${JSON.stringify(input.credentials)}::jsonb,
      stats = ${JSON.stringify(input.stats)}::jsonb,
      socials = ${JSON.stringify(input.socials)}::jsonb,
      updated_at = now()
    RETURNING *
  `;
  if (rows.length === 0) throw new Error("No hay perfil de agente configurado.");
  return rowToAgent(rows[0] as AgentRow);
}
