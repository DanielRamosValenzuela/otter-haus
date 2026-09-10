"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/content/site";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2000&auto=format&fit=crop",
  alt: "Living moderno y acogedor con decoración de lujo",
};

function HeroContent() {
  return (
    <>
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
    </>
  );
}

/**
 * Cinematic "dive into the house" scroll effect — the image is pinned
 * (sticky) while the section's extra height (180vh) is scrolled through,
 * driving a continuous zoom; the headline/CTAs fade out early so they
 * don't sit distorted over the more zoomed-in frames.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -48]);

  if (reduceMotion) {
    return (
      <section className="scrim-scope relative flex min-h-[85vh] items-center overflow-hidden text-cream-50">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/70 to-scrim/30" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <HeroContent />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="scrim-scope relative h-[180vh] text-cream-50">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/70 to-scrim/30" />

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8"
        >
          <HeroContent />
        </motion.div>
      </div>
    </section>
  );
}
