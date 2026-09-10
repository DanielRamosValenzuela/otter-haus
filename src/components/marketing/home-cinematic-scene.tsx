"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export interface SceneClip {
  src: string;
  /** Seconds — known ahead of time so playback can start scrubbing the
   * instant metadata loads, instead of racing `loadedmetadata`. */
  duration: number;
}

/** Crossfade window for clip `index` of `total`, evenly spaced with a
 * soft overlap at each boundary — the first clip starts fully visible,
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

/**
 * A walkthrough backdrop that stays fixed behind the entire home page:
 * real handheld/dolly footage (exterior → hallway → living → bar), each
 * clip's own `currentTime` scrubbed to match scroll position — so the
 * camera is always genuinely moving, tied 1:1 to how far the visitor has
 * scrolled, not autoplaying on its own clock. Clips crossfade into each
 * other rather than cutting. Content scrolls normally on top; the sticky
 * navbar (z-40) and WhatsApp button (z-30) stack above it since they
 * declare a higher z-index, and the footer — made `relative` precisely
 * so it joins this same positioned-elements paint order — naturally
 * covers it once scrolled into view.
 */
export function HomeCinematicScene({
  clips,
  children,
}: {
  clips: SceneClip[];
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const overlap = 0.04;
  const fades = clips.map((_, i) => crossfadeStops(i, clips.length, overlap));

  // Rules of Hooks needs a fixed call count — the scene is authored with
  // exactly 4 clips, so these are explicit rather than looped.
  const opacity0 = useTransform(scrollYProgress, fades[0]?.input ?? [0, 1], fades[0]?.output ?? [1, 1]);
  const opacity1 = useTransform(scrollYProgress, fades[1]?.input ?? [0, 1], fades[1]?.output ?? [0, 0]);
  const opacity2 = useTransform(scrollYProgress, fades[2]?.input ?? [0, 1], fades[2]?.output ?? [0, 0]);
  const opacity3 = useTransform(scrollYProgress, fades[3]?.input ?? [0, 1], fades[3]?.output ?? [0, 0]);
  const opacities = [opacity0, opacity1, opacity2, opacity3];

  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1, videoRef2, videoRef3];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduceMotion) return;
    const segment = 1 / clips.length;
    clips.forEach((clip, i) => {
      const video = videoRefs[i].current;
      if (!video || video.readyState < 1) return;
      const localStart = i * segment;
      const localProgress = Math.min(1, Math.max(0, (progress - localStart) / segment));
      const targetTime = localProgress * clip.duration;
      // Skip sub-frame deltas — assigning currentTime forces a decode
      // seek, and doing that every scroll tick is wasted work.
      if (Math.abs(video.currentTime - targetTime) > 0.06) {
        video.currentTime = targetTime;
      }
    });
  });

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        {clips.map((clip, i) => (
          <motion.div
            key={clip.src}
            style={reduceMotion ? { opacity: i === 0 ? 1 : 0 } : { opacity: opacities[i] }}
            className="absolute inset-0"
          >
            <video
              ref={videoRefs[i]}
              src={clip.src}
              muted
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/50 via-scrim/60 to-scrim/85" />
      </div>

      <div ref={ref} className="scrim-scope relative text-cream-50">
        {children}
      </div>
    </>
  );
}
