import { ViewTransition } from "react";
import type { ReactNode } from "react";

// Wrap a page's content so <Link transitionTypes={['nav-forward'|'nav-back']}>
// produces directional slides; anything without a transition type (browser
// back/forward, router.refresh(), Suspense reveals) animates as "none".
// Put this in each page.tsx, never in a layout — layouts persist across
// navigations, so enter/exit would never fire there.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
