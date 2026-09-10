"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { href: "/dashboard/propiedades", label: "Propiedades", newHref: "/dashboard/propiedades/nueva", cta: "Nueva propiedad" },
  { href: "/dashboard/noticias", label: "Noticias", newHref: "/dashboard/noticias/nueva", cta: "Nueva noticia" },
  { href: "/dashboard/zonas", label: "Zonas", newHref: "/dashboard/zonas/nueva", cta: "Nueva zona" },
  { href: "/dashboard/contenido", label: "Contenido", newHref: null, cta: null },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const activeSection =
    SECTIONS.find((section) => pathname.startsWith(section.href)) ?? SECTIONS[0];

  return (
    <div className="flex items-center gap-6">
      <Link href="/dashboard/propiedades" className="font-display text-xl font-semibold">
        TRAN<span className="text-gold-500">HAUS</span>
      </Link>
      <nav className="hidden items-center gap-6 sm:flex">
        {SECTIONS.map((section) => {
          const active = pathname.startsWith(section.href);
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
        {activeSection.newHref && (
          <Button as={Link} href={activeSection.newHref} size="sm">
            <Plus className="size-4" aria-hidden />
            {activeSection.cta}
          </Button>
        )}
      </div>
    </div>
  );
}
