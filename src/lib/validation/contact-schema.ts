import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre"),
  email: z.string().trim().email("Correo inválido"),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Cuéntanos un poco más en tu mensaje"),
  propertyId: z.string().trim().optional(),
  propertySlug: z.string().trim().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function parseContactFormData(formData: FormData) {
  return contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
    propertyId: formData.get("propertyId") || undefined,
    propertySlug: formData.get("propertySlug") || undefined,
  });
}
