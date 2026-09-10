export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  propertySlug?: string;
  createdAt: string;
}

export type LeadInput = Omit<Lead, "id" | "createdAt">;
