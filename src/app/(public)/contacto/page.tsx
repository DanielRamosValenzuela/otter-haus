import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { CONTACT } from "@/lib/content/site";
import { whatsappUrl } from "@/lib/utils/whatsapp";
import { ContactForm } from "@/components/forms/contact-form";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/social-icons";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para agendar una visita o resolver tus dudas.",
};

export default function ContactoPage() {
  const waHref = whatsappUrl({
    phone: CONTACT.whatsapp,
    message: "Hola, me gustaría conversar sobre una propiedad.",
  });

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="font-display text-4xl font-semibold">Contacto</h1>
          <p className="mt-4 max-w-xl text-muted-400">
            Cuéntanos qué buscas y te contactaremos a la brevedad. También puedes escribirnos
            directamente por WhatsApp.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <Card className="p-6 sm:p-8">
              <ContactForm />
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4 lg:col-span-2">
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">Otras formas de contacto</h2>
              <div className="mt-4 space-y-4 text-sm">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream-50 transition-colors hover:text-gold-400"
                >
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                  WhatsApp: {CONTACT.phoneDisplay}
                </a>
                <a
                  href={`tel:${CONTACT.phoneDisplay.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-cream-50 transition-colors hover:text-gold-400"
                >
                  <Phone className="size-5 text-gold-500" aria-hidden />
                  {CONTACT.phoneDisplay}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 text-cream-50 transition-colors hover:text-gold-400"
                >
                  <Mail className="size-5 text-gold-500" aria-hidden />
                  {CONTACT.email}
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">Zonas de cobertura</h2>
              <p className="mt-2 text-sm text-muted-400">Zona Norte · Zona Centro · Zona Sur</p>
            </Card>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
