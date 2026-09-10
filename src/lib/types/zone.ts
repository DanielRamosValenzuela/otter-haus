export interface Zone {
  slug: string;
  name: string;
  imageUrl?: string;
  description?: string;
  propertyCount: number;
}

export type ZoneInput = Omit<Zone, "propertyCount">;
