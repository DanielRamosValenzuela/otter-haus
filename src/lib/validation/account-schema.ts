import { z } from "zod";
import { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS } from "@/lib/images/allowed-hosts";

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto"),
  roleTitle: z.string().trim().optional(),
  photoUrl: z
    .string()
    .trim()
    .url("URL de imagen inválida")
    .refine(isAllowedImageUrl, {
      message: `Solo se permiten imágenes de: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
    })
    .optional(),
  bio: z.string().trim().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function parseProfileFormData(formData: FormData) {
  return profileFormSchema.safeParse({
    name: formData.get("name"),
    roleTitle: formData.get("roleTitle") || undefined,
    photoUrl: formData.get("photoUrl") || undefined,
    bio: formData.get("bio") || undefined,
  });
}

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export function parseChangePasswordFormData(formData: FormData) {
  return changePasswordFormSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
}
