import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import { slugify } from "@/lib/utils/format";
import type {
  Property,
  PropertyInput,
  PropertyListResult,
  PropertyQuery,
} from "@/lib/types/property";

const DEFAULT_PER_PAGE = 9;

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  operation: Property["operation"];
  type: Property["type"];
  status: Property["status"];
  zone_slug: string;
  zone_name: string | null;
  commune: string;
  city: string | null;
  address_hint: string | null;
  maps_url: string | null;
  maps_lat: number | null;
  maps_lng: number | null;
  price_amount: string;
  currency: Property["price"]["currency"];
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  built_area_m2: string;
  land_area_m2: string | null;
  amenities: string[];
  description: string;
  images: Property["images"];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const SELECT_PROPERTY = `
  SELECT p.*, z.name AS zone_name
  FROM properties p
  LEFT JOIN zones z ON z.slug = p.zone_slug
`;

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    operation: row.operation,
    type: row.type,
    status: row.status,
    location: {
      zone: row.zone_name ?? row.zone_slug,
      zoneSlug: row.zone_slug,
      commune: row.commune,
      city: row.city ?? undefined,
      addressHint: row.address_hint ?? undefined,
      mapsUrl: row.maps_url ?? undefined,
      mapsLat: row.maps_lat ?? undefined,
      mapsLng: row.maps_lng ?? undefined,
    },
    price: { amount: Number(row.price_amount), currency: row.currency },
    features: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      parkingSpaces: row.parking_spaces,
      builtAreaM2: Number(row.built_area_m2),
      landAreaM2: row.land_area_m2 != null ? Number(row.land_area_m2) : undefined,
      amenities: row.amenities,
    },
    description: row.description,
    images: row.images,
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sortProperties(items: Property[], sort: PropertyQuery["sort"]): Property[] {
  const sorted = [...items];
  switch (sort) {
    case "precio-asc":
      return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case "precio-desc":
      return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case "recientes":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "destacadas":
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}

export async function listProperties(query: PropertyQuery = {}): Promise<PropertyListResult> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (!query.includeUnpublished) conditions.push("p.published = true");
  if (query.operation) {
    params.push(query.operation);
    conditions.push(`p.operation = $${params.length}`);
  }
  if (query.type) {
    params.push(query.type);
    conditions.push(`p.type = $${params.length}`);
  }
  if (query.zoneSlug) {
    params.push(query.zoneSlug);
    conditions.push(`p.zone_slug = $${params.length}`);
  }
  if (query.minPrice != null) {
    params.push(query.minPrice);
    conditions.push(`p.price_amount >= $${params.length}`);
  }
  if (query.maxPrice != null) {
    params.push(query.maxPrice);
    conditions.push(`p.price_amount <= $${params.length}`);
  }
  if (query.bedrooms != null) {
    params.push(query.bedrooms);
    conditions.push(`p.bedrooms >= $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = (await sql.query(`${SELECT_PROPERTY} ${where}`, params)) as PropertyRow[];
  const filtered = sortProperties(rows.map(rowToProperty), query.sort);

  const perPage = query.perPage ?? DEFAULT_PER_PAGE;
  const page = Math.max(1, query.page ?? 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return { items, total, page, perPage, totalPages };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  "use cache";
  cacheTag("properties");
  cacheTag(`property:${slug}`);
  cacheLife("hours");

  const rows = (await sql.query(`${SELECT_PROPERTY} WHERE p.slug = $1`, [slug])) as PropertyRow[];
  if (rows.length === 0 || !rows[0].published) return null;
  return rowToProperty(rows[0]);
}

export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const rows = (await sql.query(
    `${SELECT_PROPERTY} WHERE p.published = true AND p.featured = true`,
    [],
  )) as PropertyRow[];
  return sortProperties(rows.map(rowToProperty), "recientes").slice(0, limit);
}

export async function getRelatedProperties(id: string, limit = 3): Promise<Property[]> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const currentRows = (await sql.query(`${SELECT_PROPERTY} WHERE p.id = $1`, [
    id,
  ])) as PropertyRow[];
  if (currentRows.length === 0) return [];
  const current = rowToProperty(currentRows[0]);

  const rows = (await sql.query(
    `${SELECT_PROPERTY} WHERE p.id != $1 AND p.published = true AND p.zone_slug = $2`,
    [id, current.location.zoneSlug],
  )) as PropertyRow[];
  const candidates = rows.map(rowToProperty);
  const sameType = candidates.filter((p) => p.type === current.type);
  const rest = candidates.filter((p) => p.type !== current.type);
  return [...sameType, ...rest].slice(0, limit);
}

export async function listAllPropertiesForAdmin(): Promise<Property[]> {
  const rows = (await sql.query(SELECT_PROPERTY, [])) as PropertyRow[];
  return sortProperties(rows.map(rowToProperty), "recientes");
}

export async function getPropertyByIdForAdmin(id: string): Promise<Property | null> {
  const rows = (await sql.query(`${SELECT_PROPERTY} WHERE p.id = $1`, [id])) as PropertyRow[];
  return rows.length > 0 ? rowToProperty(rows[0]) : null;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "propiedad";
  let candidate = root;
  let n = 2;
  for (;;) {
    const rows = await sql`
      SELECT 1 FROM properties WHERE slug = ${candidate} AND id IS DISTINCT FROM ${ignoreId ?? null}
    `;
    if (rows.length === 0) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const id = `prop-${crypto.randomUUID()}`;
  const slug = await uniqueSlug(input.slug || input.title);

  const rows = await sql`
    INSERT INTO properties (
      id, slug, title, operation, type, status, zone_slug, commune, city, address_hint,
      maps_url, maps_lat, maps_lng, price_amount, currency, bedrooms, bathrooms, parking_spaces,
      built_area_m2, land_area_m2, amenities, description, images, featured, published
    ) VALUES (
      ${id}, ${slug}, ${input.title}, ${input.operation}, ${input.type}, ${input.status},
      ${input.location.zoneSlug}, ${input.location.commune}, ${input.location.city ?? null},
      ${input.location.addressHint ?? null}, ${input.location.mapsUrl ?? null},
      ${input.location.mapsLat ?? null}, ${input.location.mapsLng ?? null},
      ${input.price.amount}, ${input.price.currency}, ${input.features.bedrooms},
      ${input.features.bathrooms}, ${input.features.parkingSpaces}, ${input.features.builtAreaM2},
      ${input.features.landAreaM2 ?? null}, ${JSON.stringify(input.features.amenities)}::jsonb,
      ${input.description}, ${JSON.stringify(input.images)}::jsonb, ${input.featured}, ${input.published}
    )
    RETURNING *, (SELECT name FROM zones WHERE slug = ${input.location.zoneSlug}) AS zone_name
  `;
  return rowToProperty(rows[0] as PropertyRow);
}

export async function updateProperty(id: string, input: PropertyInput): Promise<Property> {
  const slug = input.slug ? await uniqueSlug(input.slug, id) : undefined;

  const rows = await sql`
    UPDATE properties SET
      slug = COALESCE(${slug ?? null}, slug),
      title = ${input.title},
      operation = ${input.operation},
      type = ${input.type},
      status = ${input.status},
      zone_slug = ${input.location.zoneSlug},
      commune = ${input.location.commune},
      city = ${input.location.city ?? null},
      address_hint = ${input.location.addressHint ?? null},
      maps_url = ${input.location.mapsUrl ?? null},
      maps_lat = ${input.location.mapsLat ?? null},
      maps_lng = ${input.location.mapsLng ?? null},
      price_amount = ${input.price.amount},
      currency = ${input.price.currency},
      bedrooms = ${input.features.bedrooms},
      bathrooms = ${input.features.bathrooms},
      parking_spaces = ${input.features.parkingSpaces},
      built_area_m2 = ${input.features.builtAreaM2},
      land_area_m2 = ${input.features.landAreaM2 ?? null},
      amenities = ${JSON.stringify(input.features.amenities)}::jsonb,
      description = ${input.description},
      images = ${JSON.stringify(input.images)}::jsonb,
      featured = ${input.featured},
      published = ${input.published},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *, (SELECT name FROM zones WHERE slug = ${input.location.zoneSlug}) AS zone_name
  `;
  if (rows.length === 0) throw new Error(`Propiedad ${id} no encontrada`);
  return rowToProperty(rows[0] as PropertyRow);
}

export async function deleteProperty(id: string): Promise<void> {
  await sql`DELETE FROM properties WHERE id = ${id}`;
}

async function patchProperty(
  id: string,
  patch: Partial<Pick<Property, "published" | "featured">>,
): Promise<Property> {
  const rows = await sql`
    UPDATE properties SET
      published = COALESCE(${patch.published ?? null}, published),
      featured = COALESCE(${patch.featured ?? null}, featured),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *, (SELECT name FROM zones WHERE slug = properties.zone_slug) AS zone_name
  `;
  if (rows.length === 0) throw new Error(`Propiedad ${id} no encontrada`);
  return rowToProperty(rows[0] as PropertyRow);
}

export function setPropertyPublished(id: string, published: boolean): Promise<Property> {
  return patchProperty(id, { published });
}

export function setPropertyFeatured(id: string, featured: boolean): Promise<Property> {
  return patchProperty(id, { featured });
}
