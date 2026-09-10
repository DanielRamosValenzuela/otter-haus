import { z } from "zod";

import { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS } from "@/lib/images/allowed-hosts";

export const newsFormSchema = z
  .object({
    title: z.string().trim().min(3, "El título es muy corto"),
    slug: z.string().trim().optional(),
    excerpt: z
      .string()
      .trim()
      .min(10, "El resumen es muy corto")
      .max(240, "El resumen no puede superar los 240 caracteres"),
    content: z.string().trim().min(40, "Agrega un contenido más completo"),
    coverImageUrl: z
      .string()
      .url("URL de imagen inválida")
      .refine(isAllowedImageUrl, {
        message: `Solo se permiten imágenes de: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
      })
      .optional(),
    coverImageAlt: z.string().trim().optional(),
    published: z.coerce.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.coverImageUrl && !data.coverImageAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["coverImageAlt"],
        message: "La imagen de portada necesita una descripción (alt text)",
      });
    }
  });

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export function parseNewsFormData(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl") || undefined,
    coverImageAlt: formData.get("coverImageAlt") || undefined,
    published: formData.get("published") === "on",
  };
  return newsFormSchema.safeParse(raw);
}
