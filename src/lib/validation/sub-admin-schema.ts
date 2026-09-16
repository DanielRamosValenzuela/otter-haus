import { z } from "zod";

export const createSubAdminFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto"),
  email: z.string().trim().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  roleTitle: z.string().trim().optional(),
});

export type CreateSubAdminFormValues = z.infer<typeof createSubAdminFormSchema>;

export function parseCreateSubAdminFormData(formData: FormData) {
  return createSubAdminFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleTitle: formData.get("roleTitle") || undefined,
  });
}
