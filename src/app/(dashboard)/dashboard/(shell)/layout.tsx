import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// The whole authenticated dashboard is private, per-session content — it
// gets nothing from static-shell prerendering, so we opt this segment out
// of Cache Components' "instant navigation" validation entirely rather
// than contorting every page into the public-site Suspense pattern.
export const instant = false;

export default function DashboardShellLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
