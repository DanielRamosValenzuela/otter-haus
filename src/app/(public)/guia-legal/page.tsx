import type { Metadata } from "next";
import { LEGAL_GUIDE_INTRO, LEGAL_GUIDE_SECTIONS } from "@/lib/content/guia-legal";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía Legal",
  description: "Todo lo que necesitas saber para comprar o arrendar una propiedad en Chile.",
};

export default function GuiaLegalPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="font-display text-4xl font-semibold">Guía Legal</h1>
          <p className="mt-4 text-lg text-muted-400">{LEGAL_GUIDE_INTRO}</p>
        </Reveal>

        <div className="mt-12 space-y-5">
          {LEGAL_GUIDE_SECTIONS.map((section, i) => (
            <Reveal key={section.id} delay={i * 0.05}>
              <Card className="p-6">
                <h2 className="font-display text-xl font-semibold text-gold-400">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-2">
                  {section.body.map((paragraph, idx) => (
                    <li key={idx} className="text-cream-50/90">
                      {paragraph}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Card className="mt-10 flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="font-display text-xl font-semibold">¿Tienes dudas sobre tu caso?</h2>
            <p className="max-w-md text-sm text-muted-400">
              Cada operación es distinta. Conversemos sobre tu situación particular.
            </p>
            <Button as={Link} href="/contacto">
              Conversemos
            </Button>
          </Card>
        </Reveal>
      </div>
    </PageTransition>
  );
}
