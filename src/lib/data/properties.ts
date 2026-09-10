import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { readDb, writeDb } from "@/lib/data/json-store";
import { slugify } from "@/lib/utils/format";
import type {
  Property,
  PropertyInput,
  PropertyListResult,
  PropertyQuery,
} from "@/lib/types/property";

const DEFAULT_PER_PAGE = 9;

function matchesQuery(property: Property, query: PropertyQuery): boolean {
  if (!query.includeUnpublished && !property.published) return false;
  if (query.operation && property.operation !== query.operation) return false;
  if (query.type && property.type !== query.type) return false;
  if (query.zoneSlug && property.location.zoneSlug !== query.zoneSlug) return false;
  if (query.minPrice != null && property.price.amount < query.minPrice) return false;
  if (query.maxPrice != null && property.price.amount > query.maxPrice) return false;
  if (query.bedrooms != null && property.features.bedrooms < query.bedrooms) return false;
  return true;
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

/** Cached, public-facing catalog read. */
export async function listProperties(query: PropertyQuery = {}): Promise<PropertyListResult> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const db = await readDb();
  const filtered = sortProperties(
    db.properties.filter((p) => matchesQuery(p, query)),
    query.sort,
  );

  const perPage = query.perPage ?? DEFAULT_PER_PAGE;
  const page = Math.max(1, query.page ?? 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return { items, total, page, perPage, totalPages };
}

/** Cached — returns null for unpublished properties (not reachable by URL guessing). */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  "use cache";
  cacheTag("properties");
  cacheTag(`property:${slug}`);
  cacheLife("hours");

  const db = await readDb();
  const property = db.properties.find((p) => p.slug === slug);
  if (!property || !property.published) return null;
  return property;
}

/** Cached — used by the admin edit form, which needs drafts too. */
export async function getPropertyById(id: string): Promise<Property | null> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const db = await readDb();
  return db.properties.find((p) => p.id === id) ?? null;
}

export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const db = await readDb();
  return sortProperties(
    db.properties.filter((p) => p.published && p.featured),
    "recientes",
  ).slice(0, limit);
}

export async function getRelatedProperties(id: string, limit = 3): Promise<Property[]> {
  "use cache";
  cacheTag("properties");
  cacheLife("hours");

  const db = await readDb();
  const current = db.properties.find((p) => p.id === id);
  if (!current) return [];

  const candidates = db.properties.filter(
    (p) => p.id !== id && p.published && p.location.zoneSlug === current.location.zoneSlug,
  );
  const sameType = candidates.filter((p) => p.type === current.type);
  const rest = candidates.filter((p) => p.type !== current.type);
  return [...sameType, ...rest].slice(0, limit);
}

// --- Dashboard reads — uncached, always behind auth + Suspense, so the
// admin always sees their own just-made writes immediately. ---

export async function listAllPropertiesForAdmin(): Promise<Property[]> {
  const db = await readDb();
  return sortProperties(db.properties, "recientes");
}

export async function getPropertyByIdForAdmin(id: string): Promise<Property | null> {
  const db = await readDb();
  return db.properties.find((p) => p.id === id) ?? null;
}

// --- Writes. No cache calls here — invalidation (updateTag) is only
// legal inside a Server Action, so it lives in src/lib/actions/properties.ts. ---

function uniqueSlug(base: string, existing: Property[], ignoreId?: string): string {
  const root = slugify(base) || "propiedad";
  let candidate = root;
  let n = 2;
  while (existing.some((p) => p.slug === candidate && p.id !== ignoreId)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  let created!: Property;
  await writeDb((db) => {
    const now = new Date().toISOString();
    const id = `prop-${crypto.randomUUID()}`;
    created = {
      ...input,
      id,
      slug: uniqueSlug(input.slug || input.title, db.properties),
      createdAt: now,
      updatedAt: now,
    };
    return { ...db, properties: [...db.properties, created] };
  });
  return created;
}

export async function updateProperty(id: string, input: PropertyInput): Promise<Property> {
  let updated: Property | null = null;
  await writeDb((db) => {
    const index = db.properties.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Propiedad ${id} no encontrada`);
    const existing = db.properties[index];
    updated = {
      ...existing,
      ...input,
      id: existing.id,
      slug: input.slug
        ? uniqueSlug(input.slug, db.properties, id)
        : existing.slug,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const properties = [...db.properties];
    properties[index] = updated;
    return { ...db, properties };
  });
  if (!updated) throw new Error(`Propiedad ${id} no encontrada`);
  return updated;
}

export async function deleteProperty(id: string): Promise<void> {
  await writeDb((db) => ({
    ...db,
    properties: db.properties.filter((p) => p.id !== id),
  }));
}

async function patchProperty(
  id: string,
  patch: Partial<Pick<Property, "published" | "featured">>,
): Promise<Property> {
  let updated: Property | null = null;
  await writeDb((db) => {
    const index = db.properties.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Propiedad ${id} no encontrada`);
    updated = { ...db.properties[index], ...patch, updatedAt: new Date().toISOString() };
    const properties = [...db.properties];
    properties[index] = updated;
    return { ...db, properties };
  });
  if (!updated) throw new Error(`Propiedad ${id} no encontrada`);
  return updated;
}

export function setPropertyPublished(id: string, published: boolean): Promise<Property> {
  return patchProperty(id, { published });
}

export function setPropertyFeatured(id: string, featured: boolean): Promise<Property> {
  return patchProperty(id, { featured });
}
