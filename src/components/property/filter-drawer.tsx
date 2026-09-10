"use client";

import { SlidersHorizontal } from "lucide-react";
import type { PropertyQuery } from "@/lib/types/property";
import type { Zone } from "@/lib/types/zone";
import { FilterFields } from "@/components/property/filter-fields";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function FilterDrawer({ zones, query }: { zones: Zone[]; query: PropertyQuery }) {
  const activeCount = [
    query.operation,
    query.zoneSlug,
    query.type,
    query.minPrice,
    query.maxPrice,
    query.bedrooms,
  ].filter(Boolean).length;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex items-center gap-2 rounded-pill border border-cream-50/15 px-4 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:border-gold-500/50 lg:hidden">
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtros
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-gold-500 text-xs font-semibold text-scrim">
              {activeCount}
            </span>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent title="Filtros">
        <form action="/propiedades" method="get" className="flex flex-col gap-6">
          <FilterFields zones={zones} query={query} idPrefix="mobile-" />
          <Button type="submit" className="w-full">
            Ver resultados
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
