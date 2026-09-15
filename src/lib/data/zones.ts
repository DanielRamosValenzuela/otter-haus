import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import { slugify } from "@/lib/utils/format";
import type { Zone, ZoneInput } from "@/lib/types/zone";

interface ZoneRow {
  slug: string;
  name: string;
  image_url: string | null;
  description: string | null;
  property_count: string;
}

function rowToZone(row: ZoneRow): Zone {
  return {
    slug: row.slug,
    name: row.name,
    imageUrl: row.image_url ?? undefined,
    description: row.description ?? undefined,
    propertyCount: Number(row.property_count),
  };
}

const SELECT_ZONE = `
  SELECT z.*, (
    SELECT count(*) FROM properties p WHERE p.zone_slug = z.slug AND p.published = true
  ) AS property_count
  FROM zones z
`;

export async function listZones(): Promise<Zone[]> {
  "use cache";
  cacheTag("properties");
  cacheTag("zones");
  cacheLife("hours");

  const rows = (await sql.query(`${SELECT_ZONE} ORDER BY z.name`, [])) as ZoneRow[];
  return rows.map(rowToZone);
}

export async function getZoneBySlug(slug: string): Promise<Zone | null> {
  "use cache";
  cacheTag("properties");
  cacheTag("zones");
  cacheLife("hours");

  const rows = (await sql.query(`${SELECT_ZONE} WHERE z.slug = $1`, [slug])) as ZoneRow[];
  return rows.length > 0 ? rowToZone(rows[0]) : null;
}

export async function listZonesForAdmin(): Promise<ZoneInput[]> {
  const rows = await sql`SELECT slug, name, image_url, description FROM zones ORDER BY name`;
  return (rows as ZoneRow[]).map((row) => ({
    slug: row.slug,
    name: row.name,
    imageUrl: row.image_url ?? undefined,
    description: row.description ?? undefined,
  }));
}

export async function getZoneForAdmin(slug: string): Promise<ZoneInput | null> {
  const rows = await sql`
    SELECT slug, name, image_url, description FROM zones WHERE slug = ${slug}
  `;
  if (rows.length === 0) return null;
  const row = rows[0] as ZoneRow;
  return {
    slug: row.slug,
    name: row.name,
    imageUrl: row.image_url ?? undefined,
    description: row.description ?? undefined,
  };
}

async function uniqueZoneSlug(base: string, ignoreSlug?: string): Promise<string> {
  const root = slugify(base) || "zona";
  let candidate = root;
  let n = 2;
  for (;;) {
    const rows = await sql`
      SELECT 1 FROM zones WHERE slug = ${candidate} AND slug IS DISTINCT FROM ${ignoreSlug ?? null}
    `;
    if (rows.length === 0) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

export async function createZone(input: ZoneInput): Promise<Zone> {
  const slug = await uniqueZoneSlug(input.slug || input.name);
  await sql`
    INSERT INTO zones (slug, name, image_url, description)
    VALUES (${slug}, ${input.name}, ${input.imageUrl ?? null}, ${input.description ?? null})
  `;
  return { slug, name: input.name, imageUrl: input.imageUrl, description: input.description, propertyCount: 0 };
}

export async function updateZone(slug: string, input: ZoneInput): Promise<Zone> {
  const newSlug =
    input.slug && input.slug !== slug ? await uniqueZoneSlug(input.slug, slug) : slug;

  const rows = await sql`
    UPDATE zones SET
      slug = ${newSlug},
      name = ${input.name},
      image_url = ${input.imageUrl ?? null},
      description = ${input.description ?? null}
    WHERE slug = ${slug}
    RETURNING slug
  `;
  if (rows.length === 0) throw new Error(`Zona ${slug} no encontrada`);

  if (newSlug !== slug) {
    await sql`UPDATE properties SET zone_slug = ${newSlug} WHERE zone_slug = ${slug}`;
  }

  const countRows = await sql`
    SELECT count(*) AS property_count FROM properties WHERE zone_slug = ${newSlug} AND published = true
  `;
  return {
    slug: newSlug,
    name: input.name,
    imageUrl: input.imageUrl,
    description: input.description,
    propertyCount: Number((countRows[0] as { property_count: string }).property_count),
  };
}

export async function deleteZone(slug: string): Promise<void> {
  await sql`DELETE FROM zones WHERE slug = ${slug}`;
}
