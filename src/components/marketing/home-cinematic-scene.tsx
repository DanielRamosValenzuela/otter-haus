"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

export interface SceneClip {
  src: string;
  duration: number;
}

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

function subscribeIsDesktop(callback: () => void) {
  const query = window.matchMedia("(min-width: 768px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getIsDesktopSnapshot() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function getIsDesktopServerSnapshot() {
  return false;
}

function useIsDesktop() {
  return useSyncExternalStore(subscribeIsDesktop, getIsDesktopSnapshot, getIsDesktopServerSnapshot);
}

export function HomeCinematicScene({
  clips,
  children,
}: {
  clips: SceneClip[];
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const overlap = 0.04;
  const fades = clips.map((_, i) => crossfadeStops(i, clips.length, overlap));

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
    if (reduceMotion || !isDesktop) return;
    const segment = 1 / clips.length;
    clips.forEach((clip, i) => {
      const video = videoRefs[i].current;
      if (!video || video.readyState < 1) return;
      const localStart = i * segment;
      const localProgress = Math.min(1, Math.max(0, (progress - localStart) / segment));
      const targetTime = localProgress * clip.duration;
      if (Math.abs(video.currentTime - targetTime) > 0.06) {
        video.currentTime = targetTime;
      }
    });
  });

  return (
    <>
      {isDesktop && (
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
      )}

      <div ref={ref} className={isDesktop ? "scrim-scope relative text-cream-50" : undefined}>
        {children}
      </div>
    </>
  );
}
