import { z } from "zod";

import { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS } from "@/lib/images/allowed-hosts";

export const agentFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto"),
  role: z.string().trim().min(2, "El cargo es muy corto"),
  photoUrl: z
    .string()
    .trim()
    .url("URL de imagen inválida")
    .refine(isAllowedImageUrl, {
      message: `Solo se permiten imágenes de: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
    }),
  shortBio: z.string().trim().min(10, "Muy corto"),
  bio: z.string().trim().min(20, "Muy corto"),
  email: z.string().trim().email("Correo inválido"),
  phone: z.string().trim().min(6, "Teléfono muy corto"),
  whatsapp: z.string().trim().min(6, "WhatsApp muy corto"),
  coverageZones: z
    .string()
    .optional()
    .transform((raw) =>
      (raw ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  credentials: z
    .string()
    .optional()
    .transform((raw) =>
      (raw ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  stat1Label: z.string().trim().min(1, "Obligatorio"),
  stat1Value: z.string().trim().min(1, "Obligatorio"),
  stat2Label: z.string().trim().min(1, "Obligatorio"),
  stat2Value: z.string().trim().min(1, "Obligatorio"),
  stat3Label: z.string().trim().min(1, "Obligatorio"),
  stat3Value: z.string().trim().min(1, "Obligatorio"),
  instagramUrl: z.string().trim().optional(),
  facebookUrl: z.string().trim().optional(),
  linkedinUrl: z.string().trim().optional(),
  youtubeUrl: z.string().trim().optional(),
  tiktokUrl: z.string().trim().optional(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;

export function parseAgentFormData(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    role: formData.get("role"),
    photoUrl: formData.get("photoUrl"),
    shortBio: formData.get("shortBio"),
    bio: formData.get("bio"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    coverageZones: formData.get("coverageZones") || "",
    credentials: formData.get("credentials") || "",
    stat1Label: formData.get("stat1Label"),
    stat1Value: formData.get("stat1Value"),
    stat2Label: formData.get("stat2Label"),
    stat2Value: formData.get("stat2Value"),
    stat3Label: formData.get("stat3Label"),
    stat3Value: formData.get("stat3Value"),
    instagramUrl: formData.get("instagramUrl") || undefined,
    facebookUrl: formData.get("facebookUrl") || undefined,
    linkedinUrl: formData.get("linkedinUrl") || undefined,
    youtubeUrl: formData.get("youtubeUrl") || undefined,
    tiktokUrl: formData.get("tiktokUrl") || undefined,
  };
  return agentFormSchema.safeParse(raw);
}
