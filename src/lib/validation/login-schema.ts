import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
  next: z.string().trim().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export function parseLoginFormData(formData: FormData) {
  return loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });
}
