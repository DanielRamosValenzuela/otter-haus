"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { Agent } from "@/lib/types/agent";
import { StatRow } from "@/components/marketing/stat-row";
import { Button } from "@/components/ui/button";

function AgentPanel({ agent }: { agent: Agent }) {
  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
        Tu corredora
      </span>
      <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{agent.name}</h2>
      <p className="mt-3 text-muted-400">{agent.shortBio}</p>
      <div className="mt-5">
        <StatRow stats={agent.stats} />
      </div>
      <Button as={Link} href="/nosotros" variant="outline" className="mt-6">
        Conoce más sobre {agent.name.split(" ")[0]}
      </Button>
    </>
  );
}

/**
 * Second "dive-in" moment on the home page, mirroring the hero's pinned
 * scroll-zoom but mirrored horizontally (photo fills the frame, panel
 * enters from the left) so it reads as a variation, not a repeat.
 */
export function AgentCinematic({ agent }: { agent: Agent }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const panelX = useTransform(scrollYProgress, [0, 0.25], [-40, 0]);

  if (reduceMotion) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card sm:aspect-[16/10] lg:aspect-[4/5]">
            <Image
              src={agent.photoUrl}
              alt={agent.name}
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <AgentPanel agent={agent} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="scrim-scope relative h-[160vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src={agent.photoUrl}
            alt={agent.name}
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-scrim via-scrim/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim/70 via-transparent to-transparent" />

        <motion.div
          style={{ opacity: panelOpacity, x: panelX }}
          className="glass relative mx-4 max-w-md rounded-card p-8 text-cream-50 sm:mx-10 lg:mx-20"
        >
          <AgentPanel agent={agent} />
        </motion.div>
      </div>
    </section>
  );
}
