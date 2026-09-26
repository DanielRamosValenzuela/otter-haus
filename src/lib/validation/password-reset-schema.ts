import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
});

export function parseRequestPasswordResetFormData(formData: FormData) {
  return requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });
}

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export function parseResetPasswordFormData(formData: FormData) {
  return resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
}
