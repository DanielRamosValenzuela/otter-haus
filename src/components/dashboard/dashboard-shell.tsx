import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AdminBadge } from "@/components/dashboard/admin-badge";
import { AdminBadgeSkeleton } from "@/components/dashboard/admin-badge-skeleton";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-cream-50/10 bg-ink-900/60">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
          <DashboardNav />
          <Suspense fallback={<AdminBadgeSkeleton />}>
            <AdminBadge />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>

      <div className="border-t border-cream-50/10 py-6 text-center">
        <Link href="/" className="text-xs text-muted-500 hover:text-gold-400">
          ← Volver al sitio público
        </Link>
      </div>
    </div>
  );
}
