import Link from "next/link";
import { NAV_LINKS, CTA_LINK } from "@/lib/content/site";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header
      className="glass sticky top-0 z-40 border-x-0 border-t-0"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo size="md" priority />
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
