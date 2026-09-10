import Link from "next/link";
import { NAV_LINKS, CTA_LINK, SITE } from "@/lib/content/site";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header
      className="glass sticky top-0 z-40 border-x-0 border-t-0"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          TRAN<span className="text-gold-500">HAUS</span>
          <span className="sr-only"> — {SITE.name}</span>
        </Link>

        <NavLinks links={NAV_LINKS} />

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button as={Link} href={CTA_LINK.href} size="sm">
            {CTA_LINK.label}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <MobileMenu links={[...NAV_LINKS, CTA_LINK]} />
        </div>
      </div>
    </header>
  );
}
