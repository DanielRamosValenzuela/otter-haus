import { z } from "zod";

import { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS } from "@/lib/images/allowed-hosts";

export const zoneFormSchema = z
  .object({
    name: z.string().trim().min(2, "El nombre es muy corto"),
    slug: z.string().trim().optional(),
    imageUrl: z.string().trim().optional(),
    description: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.imageUrl && !isAllowedImageUrl(data.imageUrl)) {
      ctx.addIssue({
        code: "custom",
        path: ["imageUrl"],
        message: `Solo se permiten imágenes de: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
      });
    }
  });

export type ZoneFormValues = z.infer<typeof zoneFormSchema>;

export function parseZoneFormData(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    description: formData.get("description") || undefined,
  };
  return zoneFormSchema.safeParse(raw);
}
