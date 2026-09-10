import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2 pt-4">
      <PageLink href={buildHref(page - 1)} disabled={page <= 1} aria-label="Página anterior">
        <ChevronLeft className="size-4" aria-hidden />
      </PageLink>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev != null && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="text-muted-500">…</span>}
            <PageLink href={buildHref(p)} active={p === page}>
              {p}
            </PageLink>
          </span>
        );
      })}

      <PageLink
        href={buildHref(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight className="size-4" aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...props
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>) {
  if (disabled) {
    return (
      <span className="flex size-9 items-center justify-center rounded-full text-muted-600 opacity-40">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-sm transition-colors duration-200",
        active
          ? "bg-gold-500 text-scrim font-semibold"
          : "text-cream-50 hover:bg-cream-50/10",
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
