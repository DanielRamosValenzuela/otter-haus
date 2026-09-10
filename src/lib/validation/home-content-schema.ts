import { z } from "zod";

export const homeContentFormSchema = z.object({
  heroBadge: z.string().trim().min(1, "El badge es obligatorio"),
  heroTitle: z.string().trim().min(3, "El título es muy corto"),
  heroSubtitle: z.string().trim().min(5, "El subtítulo es muy corto"),
  heroPrimaryCta: z.string().trim().min(1, "El texto del botón es obligatorio"),
  heroSecondaryCta: z.string().trim().min(1, "El texto del botón es obligatorio"),
  zoneEyebrow: z.string().trim().min(1, "El eyebrow es obligatorio"),
  zoneTitle: z.string().trim().min(3, "El título es muy corto"),
  zoneDescription: z.string().trim().min(5, "La descripción es muy corta"),
  featuredEyebrow: z.string().trim().min(1, "El eyebrow es obligatorio"),
  featuredTitle: z.string().trim().min(3, "El título es muy corto"),
  featuredDescription: z.string().trim().min(5, "La descripción es muy corta"),
});

export type HomeContentFormValues = z.infer<typeof homeContentFormSchema>;

export function parseHomeContentFormData(formData: FormData) {
  const raw = {
    heroBadge: formData.get("heroBadge"),
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    heroPrimaryCta: formData.get("heroPrimaryCta"),
    heroSecondaryCta: formData.get("heroSecondaryCta"),
    zoneEyebrow: formData.get("zoneEyebrow"),
    zoneTitle: formData.get("zoneTitle"),
    zoneDescription: formData.get("zoneDescription"),
    featuredEyebrow: formData.get("featuredEyebrow"),
    featuredTitle: formData.get("featuredTitle"),
    featuredDescription: formData.get("featuredDescription"),
  };
  return homeContentFormSchema.safeParse(raw);
}
