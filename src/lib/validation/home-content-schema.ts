import { z } from "zod";

import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import { VALUE_PROP_ICONS } from "@/lib/types/home-content";

const required = (label: string, max: number) =>
  z.string().trim().min(1, `${label} es obligatorio`).max(max, `Máximo ${max} caracteres`);

const href = z
  .string()
  .trim()
  .min(1, "El enlace es obligatorio")
  .max(300, "Máximo 300 caracteres")
  .refine(
    (value) => /^\/(?![/\\])[^\s\\]*$/.test(value) || value.startsWith("https://"),
    "Usa una ruta interna (/propiedades) o una URL https://",
  );

const valueItemSchema = z.object({
  id: z.string().trim().min(1).max(80).optional(),
  icon: z.enum(VALUE_PROP_ICONS, "Elige un ícono válido"),
  title: required("El título", 80),
  description: required("La descripción", 300),
});

export const homeContentFormSchema = z.object({
  heroBadge: required("El badge", 80),
  heroTitle: required("El título", 150),
  heroSubtitle: required("El subtítulo", 400),
  heroPrimaryCta: required("El texto del botón", 40),
  heroPrimaryHref: href,
  heroSecondaryCta: required("El texto del botón", 40),
  heroSecondaryHref: href,
  heroMobileImageUrl: z
    .string()
    .trim()
    .min(1, "La imagen es obligatoria")
    .max(1000, "Máximo 1000 caracteres")
    .refine(isAllowedImageUrl, "Sube una imagen o usa una URL https de un host permitido"),
  heroMobileImageAlt: required("El texto alternativo", 150),
  zoneVisible: z.boolean(),
  zoneEyebrow: required("El eyebrow", 60),
  zoneTitle: required("El título", 150),
  zoneDescription: required("La descripción", 400),
  featuredVisible: z.boolean(),
  featuredEyebrow: required("El eyebrow", 60),
  featuredTitle: required("El título", 150),
  featuredDescription: required("La descripción", 400),
  valueVisible: z.boolean(),
  valueEyebrow: required("El eyebrow", 60),
  valueTitle: required("El título", 150),
  valueItems: z
    .array(valueItemSchema)
    .min(1, "Agrega al menos un beneficio")
    .max(8, "Máximo 8 beneficios"),
  teamVisible: z.boolean(),
  teamSingleEyebrow: required("El eyebrow", 60),
  teamSingleCtaLabel: required("El texto del botón", 60),
  teamEyebrow: required("El eyebrow", 60),
  teamTitle: required("El título", 150),
  teamCtaLabel: required("El texto del botón", 60),
  footerDescription: z
    .string()
    .trim()
    .min(5, "El texto es muy corto")
    .max(200, "Máximo 200 caracteres"),
});

export type HomeContentFormValues = z.infer<typeof homeContentFormSchema>;

const TEXT_FIELDS = [
  "heroBadge",
  "heroTitle",
  "heroSubtitle",
  "heroPrimaryCta",
  "heroPrimaryHref",
  "heroSecondaryCta",
  "heroSecondaryHref",
  "heroMobileImageUrl",
  "heroMobileImageAlt",
  "zoneEyebrow",
  "zoneTitle",
  "zoneDescription",
  "featuredEyebrow",
  "featuredTitle",
  "featuredDescription",
  "valueEyebrow",
  "valueTitle",
  "teamSingleEyebrow",
  "teamSingleCtaLabel",
  "teamEyebrow",
  "teamTitle",
  "teamCtaLabel",
  "footerDescription",
] as const;

const CHECKBOX_FIELDS = ["zoneVisible", "featuredVisible", "valueVisible", "teamVisible"] as const;

export function parseHomeContentFormData(formData: FormData) {
  let valueItems: unknown = [];
  try {
    valueItems = JSON.parse(String(formData.get("valueItems") ?? "[]"));
  } catch {
    valueItems = [];
  }
  const raw: Record<string, unknown> = { valueItems };
  for (const field of TEXT_FIELDS) raw[field] = formData.get(field);
  for (const field of CHECKBOX_FIELDS) raw[field] = formData.has(field);
  return homeContentFormSchema.safeParse(raw);
}
