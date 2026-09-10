export interface Zone {
  slug: string;
  name: string;
  imageUrl?: string;
  description?: string;
  /** Computed at read time — count of published properties in this zone. */
  propertyCount: number;
}

export type ZoneInput = Omit<Zone, "propertyCount">;
