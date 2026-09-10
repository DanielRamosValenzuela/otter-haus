import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { readDb, writeDb } from "@/lib/data/json-store";
import { slugify } from "@/lib/utils/format";
import type { Zone, ZoneInput } from "@/lib/types/zone";

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

export async function listZonesForAdmin(): Promise<ZoneInput[]> {
  const db = await readDb();
  return db.zones;
}

export async function getZoneForAdmin(slug: string): Promise<ZoneInput | null> {
  const db = await readDb();
  return db.zones.find((z) => z.slug === slug) ?? null;
}

function uniqueZoneSlug(base: string, existing: ZoneInput[], ignoreSlug?: string): string {
  const root = slugify(base) || "zona";
  let candidate = root;
  let n = 2;
  while (existing.some((z) => z.slug === candidate && z.slug !== ignoreSlug)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createZone(input: ZoneInput): Promise<Zone> {
  let created!: Zone;
  await writeDb((db) => {
    const slug = uniqueZoneSlug(input.slug || input.name, db.zones);
    const zone: ZoneInput = { ...input, slug };
    created = { ...zone, propertyCount: 0 };
    return { ...db, zones: [...db.zones, zone] };
  });
  return created;
}

export async function updateZone(slug: string, input: ZoneInput): Promise<Zone> {
  let updated: Zone | null = null;
  await writeDb((db) => {
    const index = db.zones.findIndex((z) => z.slug === slug);
    if (index === -1) throw new Error(`Zona ${slug} no encontrada`);
    const existing = db.zones[index];
    const newSlug =
      input.slug && input.slug !== existing.slug
        ? uniqueZoneSlug(input.slug, db.zones, existing.slug)
        : existing.slug;
    const zone: ZoneInput = { ...existing, ...input, slug: newSlug };
    const zones = [...db.zones];
    zones[index] = zone;
    const properties =
      newSlug !== existing.slug
        ? db.properties.map((p) =>
            p.location.zoneSlug === existing.slug
              ? { ...p, location: { ...p.location, zoneSlug: newSlug } }
              : p,
          )
        : db.properties;
    updated = {
      ...zone,
      propertyCount: properties.filter((p) => p.published && p.location.zoneSlug === newSlug)
        .length,
    };
    return { ...db, zones, properties };
  });
  if (!updated) throw new Error(`Zona ${slug} no encontrada`);
  return updated;
}

export async function deleteZone(slug: string): Promise<void> {
  await writeDb((db) => ({
    ...db,
    zones: db.zones.filter((z) => z.slug !== slug),
  }));
}
