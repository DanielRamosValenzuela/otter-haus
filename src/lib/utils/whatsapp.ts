import type { Property } from "@/lib/types/property";
import { formatPrice } from "@/lib/utils/format";

export function whatsappUrl({ phone, message }: { phone: string; message: string }): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${phone}?${params.toString()}`;
}

export function propertyInquiryMessage(property: Property): string {
  return `Hola, me interesa la propiedad "${property.title}" (${formatPrice(property.price)}) en ${property.location.commune}. ¿Podrías darme más información?`;
}
