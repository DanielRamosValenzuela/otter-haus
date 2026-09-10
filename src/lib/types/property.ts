export const OPERATIONS = ["venta", "arriendo"] as const;
export type Operation = (typeof OPERATIONS)[number];

export const PROPERTY_TYPES = [
  "casa",
  "departamento",
  "terreno",
  "oficina",
  "parcela",
  "local",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_STATUSES = ["disponible", "reservada", "cerrada"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export type Currency = "UF" | "CLP";

export interface PropertyImage {
  url: string;
  alt: string;
}

export interface PropertyLocation {
  /** Display label, sourced from the editable zones catalog: "Zona Norte". */
  zone: string;
  /** URL/filter key for the zone: "zona-norte". */
  zoneSlug: string;
  commune: string;
  city?: string;
  /** Approximate area reference — never an exact street address. */
  addressHint?: string;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  builtAreaM2: number;
  landAreaM2?: number;
  amenities: string[];
}

export interface PropertyPrice {
  amount: number;
  currency: Currency;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  operation: Operation;
  type: PropertyType;
  status: PropertyStatus;
  location: PropertyLocation;
  price: PropertyPrice;
  features: PropertyFeatures;
  description: string;
  images: PropertyImage[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PropertyInput = Omit<
  Property,
  "id" | "slug" | "createdAt" | "updatedAt"
> & { slug?: string };

export type PropertySort =
  | "destacadas"
  | "recientes"
  | "precio-asc"
  | "precio-desc";

export interface PropertyQuery {
  operation?: Operation;
  type?: PropertyType;
  zoneSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number; // interpreted as "N+"
  sort?: PropertySort;
  page?: number;
  perPage?: number;
  /** Dashboard only — defaults to false for every public read. */
  includeUnpublished?: boolean;
}

export interface PropertyListResult {
  items: Property[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
