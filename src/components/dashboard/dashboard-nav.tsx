"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/layout/logo";
import type { AccountRole } from "@/lib/types/admin";

const SECTIONS = [
  { href: "/dashboard/propiedades", label: "Propiedades", adminOnly: false },
  { href: "/dashboard/noticias", label: "Noticias", adminOnly: false },
  { href: "/dashboard/zonas", label: "Zonas", adminOnly: true },
  { href: "/dashboard/contenido", label: "Contenido", adminOnly: true },
  { href: "/dashboard/cuentas", label: "Cuentas", adminOnly: true },
  { href: "/dashboard/cuenta", label: "Mi cuenta", adminOnly: false },
] as const;

function isActiveSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav({ role }: { role: AccountRole }) {
  const pathname = usePathname();
  const sections = SECTIONS.filter((section) => !section.adminOnly || role === "admin");

  return (
    <div className="flex items-center gap-6">
      <Link href="/dashboard/propiedades">
        <Logo size="sm" />
      </Link>
      <nav className="hidden items-center gap-6 sm:flex">
        {sections.map((section) => {
          const active = isActiveSection(pathname, section.href);
          return (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                "group relative py-2 text-sm font-medium text-muted-400 transition-colors hover:text-cream-50",
                active && "text-cream-50",
              )}
            >
              {section.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-500 transition-transform duration-300 ease-lux",
                  "group-hover:scale-x-100",
                  active && "scale-x-100",
                )}
              />
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
