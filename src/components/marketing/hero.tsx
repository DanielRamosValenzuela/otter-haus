import Link from "next/link";
import { SITE } from "@/lib/content/site";
import { Button } from "@/components/ui/button";

/**
 * Text-only now — the background photo lives in HomeCinematicScene,
 * shared across the whole home page instead of being scoped to the hero.
 */
export function Hero() {
  return (
    <section className="flex min-h-[85vh] items-center">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center rounded-pill border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          Lujo &amp; confort en Chile
        </span>

        <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
          {SITE.tagline}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-cream-50/85">
          En <span className="font-semibold text-gold-400">TranHaus</span> redefinimos la
          experiencia inmobiliaria con asesoría de alto nivel y propiedades exclusivas.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button as={Link} href="/propiedades" size="lg">
            Ver propiedades
          </Button>
          <Button as={Link} href="/nosotros" variant="outline" size="lg">
            Conócenos
          </Button>
        </div>
      </div>
    </section>
  );
}
