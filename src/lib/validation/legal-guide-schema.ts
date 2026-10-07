import { z } from "zod";

const sectionSchema = z.object({
  id: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1, "El título es obligatorio").max(150, "Máximo 150 caracteres"),
  body: z
    .string()
    .max(4000, "Máximo 4000 caracteres")
    .refine((value) => value.trim().length > 0, "Agrega al menos un punto"),
});

export const legalGuideFormSchema = z.object({
  intro: z.string().trim().min(5, "La introducción es muy corta").max(2000, "Máximo 2000 caracteres"),
  sections: z.array(sectionSchema).min(1, "Agrega al menos una sección").max(30, "Máximo 30 secciones"),
});

export function parseLegalGuideFormData(formData: FormData) {
  let sections: unknown = [];
  try {
    sections = JSON.parse(String(formData.get("sections") ?? "[]"));
  } catch {
    sections = [];
  }
  return legalGuideFormSchema.safeParse({ intro: formData.get("intro"), sections });
}
