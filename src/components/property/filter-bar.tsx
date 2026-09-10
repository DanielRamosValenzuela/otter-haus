import Link from "next/link";
import type { PropertyQuery } from "@/lib/types/property";
import type { Zone } from "@/lib/types/zone";
import { FilterFields } from "@/components/property/filter-fields";
import { Button } from "@/components/ui/button";

export function FilterBar({ zones, query }: { zones: Zone[]; query: PropertyQuery }) {
  const hasFilters =
    query.operation || query.zoneSlug || query.type || query.minPrice || query.maxPrice || query.bedrooms;

  return (
    <form
      action="/propiedades"
      method="get"
      className="hidden lg:block glass sticky top-[calc(4.5rem+1px)] z-20 rounded-card p-5"
    >
      <FilterFields zones={zones} query={query} />
      <div className="mt-4 flex items-center gap-4">
        <Button type="submit" size="sm">
          Aplicar filtros
        </Button>
        {hasFilters && (
          <Link href="/propiedades" className="text-sm text-muted-400 underline-offset-4 hover:text-gold-400 hover:underline">
            Limpiar filtros
          </Link>
        )}
      </div>
    </form>
  );
}
