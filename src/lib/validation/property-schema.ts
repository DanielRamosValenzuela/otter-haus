import { z } from "zod";

import { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS } from "@/lib/images/allowed-hosts";
import {
  OPERATIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "@/lib/types/property";

const imageSchema = z.object({
  url: z
    .string()
    .url("URL de imagen inválida")
    .refine(isAllowedImageUrl, {
      message: `Solo se permiten imágenes de: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
    }),
  alt: z.string().min(1, "Cada imagen necesita una descripción (alt text)"),
});

const imagesFieldSchema = z
  .string()
  .min(1, "Agrega al menos una imagen")
  .transform((raw, ctx) => {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: "Formato de imágenes inválido" });
      return z.NEVER;
    }
  })
  .pipe(z.array(imageSchema).min(1, "Agrega al menos una imagen"));

const CUSTOM_ZONE_VALUE = "__custom__";

export const propertyFormSchema = z
  .object({
    title: z.string().trim().min(3, "El título es muy corto"),
    slug: z.string().trim().optional(),
    operation: z.enum(OPERATIONS),
    type: z.enum(PROPERTY_TYPES),
    status: z.enum(PROPERTY_STATUSES),
    zoneSlug: z.string().trim().min(1, "Selecciona una zona"),
    customZoneName: z.string().trim().optional(),
    commune: z.string().trim().min(1, "La comuna es obligatoria"),
    city: z.string().trim().optional(),
    addressHint: z.string().trim().optional(),
    priceAmount: z.coerce.number().positive("El precio debe ser mayor a 0"),
    bedrooms: z.coerce.number().int().min(0),
    bathrooms: z.coerce.number().int().min(0),
    parkingSpaces: z.coerce.number().int().min(0),
    builtAreaM2: z.coerce.number().min(0),
    landAreaM2: z.coerce.number().min(0).optional(),
    amenities: z
      .string()
      .optional()
      .transform((raw) =>
        (raw ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    description: z.string().trim().min(20, "Agrega una descripción más completa"),
    images: imagesFieldSchema,
    featured: z.coerce.boolean().optional().default(false),
    published: z.coerce.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.zoneSlug === CUSTOM_ZONE_VALUE && !data.customZoneName) {
      ctx.addIssue({
        code: "custom",
        path: ["customZoneName"],
        message: "Escribe el nombre de la nueva zona",
      });
    }
    if (
      (data.type === "terreno" || data.type === "parcela") &&
      (data.landAreaM2 == null || data.landAreaM2 <= 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["landAreaM2"],
        message: "La superficie de terreno es obligatoria para este tipo de propiedad",
      });
    }
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function parsePropertyFormData(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    operation: formData.get("operation"),
    type: formData.get("type"),
    status: formData.get("status"),
    zoneSlug: formData.get("zoneSlug"),
    customZoneName: formData.get("customZoneName") || undefined,
    commune: formData.get("commune"),
    city: formData.get("city") || undefined,
    addressHint: formData.get("addressHint") || undefined,
    priceAmount: formData.get("priceAmount"),
    bedrooms: formData.get("bedrooms") || 0,
    bathrooms: formData.get("bathrooms") || 0,
    parkingSpaces: formData.get("parkingSpaces") || 0,
    builtAreaM2: formData.get("builtAreaM2") || 0,
    landAreaM2: formData.get("landAreaM2") || undefined,
    amenities: formData.get("amenities") || "",
    description: formData.get("description"),
    images: formData.get("images") || "[]",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
  return propertyFormSchema.safeParse(raw);
}

export { CUSTOM_ZONE_VALUE };
