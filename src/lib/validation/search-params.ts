import {
  OPERATIONS,
  PROPERTY_TYPES,
  type Operation,
  type PropertyQuery,
  type PropertySort,
  type PropertyType,
} from "@/lib/types/property";

const SORTS: PropertySort[] = ["destacadas", "recientes", "precio-asc", "precio-desc"];

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parsePropertySearchParams(sp: RawSearchParams): PropertyQuery {
  const operation = first(sp.operacion);
  const type = first(sp.tipo);
  const sort = first(sp.orden);

  return {
    operation: OPERATIONS.includes(operation as Operation) ? (operation as Operation) : undefined,
    type: PROPERTY_TYPES.includes(type as PropertyType) ? (type as PropertyType) : undefined,
    zoneSlug: first(sp.zona) || undefined,
    minPrice: toInt(first(sp.precioMin)),
    maxPrice: toInt(first(sp.precioMax)),
    bedrooms: toInt(first(sp.dormitorios)),
    sort: SORTS.includes(sort as PropertySort) ? (sort as PropertySort) : undefined,
    page: toInt(first(sp.pagina)) || 1,
  };
}

export function buildPropertyQueryString(query: PropertyQuery): string {
  const params = new URLSearchParams();
  if (query.operation) params.set("operacion", query.operation);
  if (query.type) params.set("tipo", query.type);
  if (query.zoneSlug) params.set("zona", query.zoneSlug);
  if (query.minPrice != null) params.set("precioMin", String(query.minPrice));
  if (query.maxPrice != null) params.set("precioMax", String(query.maxPrice));
  if (query.bedrooms != null) params.set("dormitorios", String(query.bedrooms));
  if (query.sort) params.set("orden", query.sort);
  if (query.page && query.page > 1) params.set("pagina", String(query.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
