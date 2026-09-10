import { Suspense } from "react";
import { Hero } from "@/components/marketing/hero";
import { ValueProps } from "@/components/marketing/value-props";
import { ZoneGrid } from "@/components/marketing/zone-grid";
import { ZoneGridSkeleton } from "@/components/marketing/zone-grid-skeleton";
import { FeaturedProperties } from "@/components/property/featured-properties";
import { PropertyGridSkeleton } from "@/components/property/property-grid-skeleton";
import { AgentTeaser } from "@/components/marketing/agent-teaser";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Explora por zona"
            title="Encuentra tu próximo hogar"
            description="Recorre nuestro catálogo organizado por las zonas donde tenemos mayor presencia."
          />
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<ZoneGridSkeleton />}>
            <ZoneGrid />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Selección TranHaus"
            title="Propiedades destacadas"
            description="Una muestra de las propiedades que hoy están disponibles."
          />
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<PropertyGridSkeleton n={4} />}>
            <FeaturedProperties />
          </Suspense>
        </div>
      </section>

      <ValueProps />

      <Suspense fallback={null}>
        <AgentTeaser />
      </Suspense>
    </>
  );
}
