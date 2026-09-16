"use client";

import { Suspense, useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function ScrollGuard() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
    document.body.removeAttribute("data-scroll-locked");
    lenis?.resize();
    lenis?.start();
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      <Suspense fallback={null}>
        <ScrollGuard />
      </Suspense>
      {children}
    </ReactLenis>
  );
}
