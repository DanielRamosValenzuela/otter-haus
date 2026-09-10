import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { readDb, writeDb } from "@/lib/data/json-store";
import type { Agent, AgentInput } from "@/lib/types/agent";

export async function getAgent(): Promise<Agent> {
  "use cache";
  cacheTag("agent");
  cacheLife("days");

  const db = await readDb();
  return db.agent;
}

export async function updateAgent(input: AgentInput): Promise<Agent> {
  let updated!: Agent;
  await writeDb((db) => {
    updated = { ...db.agent, ...input, updatedAt: new Date().toISOString() };
    return { ...db, agent: updated };
  });
  return updated;
}
