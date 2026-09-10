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
import { HomeCinematicScene } from "@/components/marketing/home-cinematic-scene";

const SCENE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    alt: "Fachada de casa moderna de lujo al atardecer",
  },
  {
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2000&auto=format&fit=crop",
    alt: "Living moderno y acogedor con decoración de lujo",
  },
  {
    src: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=2000&auto=format&fit=crop",
    alt: "Cocina moderna con terminaciones de lujo",
  },
  {
    src: "https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=2000&auto=format&fit=crop",
    alt: "Dormitorio principal luminoso y elegante",
  },
  {
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2000&auto=format&fit=crop",
    alt: "Baño moderno con terminaciones de alto estándar",
  },
];

export default function HomePage() {
  return (
    <HomeCinematicScene images={SCENE_IMAGES}>
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

      {/* Spacer so the fixed backdrop has room to finish its drift/zoom
          before the (opaque) footer scrolls up and naturally covers it. */}
      <div className="h-24" aria-hidden />
    </HomeCinematicScene>
  );
}
