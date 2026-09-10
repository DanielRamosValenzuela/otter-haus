"use client";

import { useRef, type ComponentProps } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";

/**
 * A photo that grows slightly on its own as it travels through the
 * viewport (independent of any hover state), so photography across the
 * site feels continuously "alive" while scrolling — the same visual
 * language as the hero's dive-in zoom, applied lightly to grid imagery.
 * Compose with a hover-scale class on `imageClassName` — transforms on
 * the outer (scroll-driven) and inner (hover) elements multiply instead
 * of fighting over the same `transform` property.
 */
export function ScrollZoomImage({
  alt,
  imageClassName,
  ...imageProps
}: Omit<ComponentProps<typeof Image>, "fill"> & { imageClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.12, 1.22]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={reduceMotion ? undefined : { scale }} className="absolute inset-0">
        <Image fill alt={alt} className={cn("object-cover", imageClassName)} {...imageProps} />
      </motion.div>
    </div>
  );
}
