import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/content/site";
import { Button } from "@/components/ui/button";

const MOBILE_BACKGROUND = {
  src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  alt: "Fachada de casa moderna de lujo",
};

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      <div className="absolute inset-0 md:hidden">
        <Image
          src={MOBILE_BACKGROUND.src}
          alt={MOBILE_BACKGROUND.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/50 via-scrim/60 to-scrim/85" />
      </div>

      <div className="scrim-scope relative mx-auto max-w-3xl px-4 py-24 text-center text-cream-50 sm:px-6 lg:px-8">
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
