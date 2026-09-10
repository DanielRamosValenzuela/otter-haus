"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

// Global momentum scroll for the public site — Lenis respects
// prefers-reduced-motion out of the box (falls back to native 1:1 scroll).
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
