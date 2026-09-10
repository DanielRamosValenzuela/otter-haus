"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export interface SceneImage {
  src: string;
  alt: string;
}

const ZOOM_TARGET = 1.4;

/** Crossfade window for image `index` of `total`, evenly spaced with a
 * soft overlap at each boundary — the first image starts fully visible,
 * the last stays fully visible through the end, so there's no dead zone
 * before/after the sequence. */
function crossfadeStops(index: number, total: number, overlap: number) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;

  if (index === 0 && total === 1) return { input: [0, 1], output: [1, 1] };
  if (index === 0) return { input: [0, end - overlap, end + overlap], output: [1, 1, 0] };
  if (index === total - 1) {
    return { input: [start - overlap, start + overlap, 1], output: [0, 1, 1] };
  }
  return {
    input: [start - overlap, start + overlap, end - overlap, end + overlap],
    output: [0, 1, 1, 0],
  };
}

/** Each image keeps pushing the camera forward (zooming in) for its
 * whole time on screen, reaching maximum zoom right as it hands off to
 * the next one — the "hidden cut" trick: swapping images while one is
 * zoomed in and blown-past-detail reads as crossing a threshold (the
 * exterior "pushes through the door") rather than a photo change. */
function zoomStops(index: number, total: number, overlap: number) {
  const segment = 1 / total;
  const start = index * segment;
  const end = Math.min((index + 1) * segment + overlap, 1);
  return { input: [start, end], output: [1, ZOOM_TARGET] };
}

/**
 * A walkthrough backdrop that stays fixed behind the entire home page:
 * one continuous image sequence (exterior → living room → kitchen → …)
 * that never visibly cuts — each frame zooms forward into the next,
 * crossfading only at its zoomed-in peak, so the whole scroll reads as
 * one unbroken camera move deeper into the house instead of a slideshow.
 * Content scrolls normally on top; the sticky navbar (z-40) and
 * WhatsApp button (z-30) stack above it since they declare a higher
 * z-index, and the footer — a normal opaque block later in the DOM —
 * naturally covers it once scrolled into view.
 */
export function HomeCinematicScene({
  images,
  children,
}: {
  images: SceneImage[];
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const overlap = 0.05;
  const fades = images.map((_, i) => crossfadeStops(i, images.length, overlap));
  const zooms = images.map((_, i) => zoomStops(i, images.length, overlap));

  // Rules of Hooks needs a fixed call count — the scene is authored with
  // exactly 5 images, so these are explicit rather than looped.
  const opacity0 = useTransform(scrollYProgress, fades[0]?.input ?? [0, 1], fades[0]?.output ?? [1, 1]);
  const opacity1 = useTransform(scrollYProgress, fades[1]?.input ?? [0, 1], fades[1]?.output ?? [0, 0]);
  const opacity2 = useTransform(scrollYProgress, fades[2]?.input ?? [0, 1], fades[2]?.output ?? [0, 0]);
  const opacity3 = useTransform(scrollYProgress, fades[3]?.input ?? [0, 1], fades[3]?.output ?? [0, 0]);
  const opacity4 = useTransform(scrollYProgress, fades[4]?.input ?? [0, 1], fades[4]?.output ?? [0, 0]);
  const opacities = [opacity0, opacity1, opacity2, opacity3, opacity4];

  const scale0 = useTransform(scrollYProgress, zooms[0]?.input ?? [0, 1], zooms[0]?.output ?? [1, 1]);
  const scale1 = useTransform(scrollYProgress, zooms[1]?.input ?? [0, 1], zooms[1]?.output ?? [1, 1]);
  const scale2 = useTransform(scrollYProgress, zooms[2]?.input ?? [0, 1], zooms[2]?.output ?? [1, 1]);
  const scale3 = useTransform(scrollYProgress, zooms[3]?.input ?? [0, 1], zooms[3]?.output ?? [1, 1]);
  const scale4 = useTransform(scrollYProgress, zooms[4]?.input ?? [0, 1], zooms[4]?.output ?? [1, 1]);
  const scales = [scale0, scale1, scale2, scale3, scale4];

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        {reduceMotion ? (
          <Image src={images[0].src} alt={images[0].alt} fill priority sizes="100vw" className="object-cover" />
        ) : (
          images.map((image, i) => (
            <motion.div
              key={image.src}
              style={{ opacity: opacities[i], scale: scales[i] }}
              className="absolute inset-0"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          ))
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/50 via-scrim/60 to-scrim/85" />
      </div>

      <div ref={ref} className="scrim-scope relative text-cream-50">
        {children}
      </div>
    </>
  );
}
