import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { readDb, writeDb } from "@/lib/data/json-store";
import type { HomeContent, HomeContentInput } from "@/lib/types/home-content";

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag("home-content");
  cacheLife("days");

  const db = await readDb();
  return db.homeContent;
}

export async function updateHomeContent(input: HomeContentInput): Promise<HomeContent> {
  let updated!: HomeContent;
  await writeDb((db) => {
    updated = { ...db.homeContent, ...input, updatedAt: new Date().toISOString() };
    return { ...db, homeContent: updated };
  });
  return updated;
}
