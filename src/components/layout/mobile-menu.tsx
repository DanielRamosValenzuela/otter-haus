"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";

export function MobileMenu({ links }: { links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className="flex size-10 items-center justify-center rounded-full text-cream-50 hover:bg-cream-50/10 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" aria-hidden />
      </DrawerTrigger>
      <DrawerContent title="Menú">
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <DrawerClose key={link.href} asChild>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-cream-50 transition-colors hover:bg-cream-50/5"
              >
                {link.label}
              </Link>
            </DrawerClose>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
