import { Suspense } from "react";
import type { Metadata } from "next";
import { getLegalGuide } from "@/lib/data/legal-guide";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichInline, RichText } from "@/components/ui/rich-text";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía Legal",
  description: "Todo lo que necesitas saber para comprar o arrendar una propiedad en Chile.",
  alternates: { canonical: "/guia-legal" },
};

async function LegalGuideContent() {
  const guide = await getLegalGuide();

  return (
    <>
      <Reveal>
        <h1 className="font-display text-4xl font-semibold">Guía Legal</h1>
        <RichText text={guide.intro} className="mt-4 space-y-4 text-lg text-muted-400" />
      </Reveal>

      <div className="mt-12 space-y-5">
        {guide.sections.map((section, i) => (
          <Reveal key={section.id} delay={i * 0.05}>
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-gold-400">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-cream-50/90">
                    <RichInline text={item} />
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </>
  );
}

export default function GuiaLegalPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          }
        >
          <LegalGuideContent />
        </Suspense>

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
