import type { Property } from "@/lib/types/property";
import { CONTACT } from "@/lib/content/site";
import { whatsappUrl, propertyInquiryMessage } from "@/lib/utils/whatsapp";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppIcon } from "@/components/icons/social-icons";

export function PropertyContactCard({ property }: { property: Property }) {
  const href = whatsappUrl({ phone: CONTACT.whatsapp, message: propertyInquiryMessage(property) });

  return (
    <Card className="sticky top-24 space-y-5 p-6">
      <div>
        <h3 className="font-display text-lg font-semibold">¿Te interesa esta propiedad?</h3>
        <p className="mt-1 text-sm text-muted-400">Escríbenos y te responderemos a la brevedad.</p>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-[#25D366] font-medium text-white transition-transform duration-200 ease-lux hover:scale-[1.02] active:scale-95"
      >
        <WhatsAppIcon className="size-5" />
        Escribir por WhatsApp
      </a>

      <div className="flex items-center gap-3 text-xs text-muted-500">
        <span className="h-px flex-1 bg-cream-50/10" />
        o déjanos tus datos
        <span className="h-px flex-1 bg-cream-50/10" />
      </div>

      <ContactForm property={property} compact />
    </Card>
  );
}
