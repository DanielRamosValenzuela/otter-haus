import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { readDb } from "@/lib/data/json-store";
import type { Zone } from "@/lib/types/zone";

export async function listZones(): Promise<Zone[]> {
  "use cache";
  cacheTag("properties");
  cacheTag("zones");
  cacheLife("hours");

  const db = await readDb();
  return db.zones.map((zone) => ({
    ...zone,
    propertyCount: db.properties.filter(
      (p) => p.published && p.location.zoneSlug === zone.slug,
    ).length,
  }));
}

export async function getZoneBySlug(slug: string): Promise<Zone | null> {
  "use cache";
  cacheTag("properties");
  cacheTag("zones");
  cacheLife("hours");

  const db = await readDb();
  const zone = db.zones.find((z) => z.slug === slug);
  if (!zone) return null;
  return {
    ...zone,
    propertyCount: db.properties.filter(
      (p) => p.published && p.location.zoneSlug === zone.slug,
    ).length,
  };
}
