"use client";

import { useRef, type ComponentProps } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";

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
