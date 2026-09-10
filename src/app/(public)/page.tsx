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

// Real handheld/dolly footage of one property (Kindel Media, Pexels —
// free license, no attribution required) — exterior approach, hallway,
// living/dining, home bar, in that walkthrough order. Durations are
// read from each file (`ffprobe`-equivalent via the browser) so
// scroll-scrubbing maps 1:1 onto the actual clip length.
const SCENE_CLIPS = [
  { src: "/videos/home-scene/01-exterior.mp4", duration: 20.07 },
  { src: "/videos/home-scene/02-hallway.mp4", duration: 7.615 },
  { src: "/videos/home-scene/03-living.mp4", duration: 20.95 },
  { src: "/videos/home-scene/04-bar.mp4", duration: 23.85 },
];

export default function HomePage() {
  return (
    <HomeCinematicScene clips={SCENE_CLIPS}>
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
