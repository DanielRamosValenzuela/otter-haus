import Link from "next/link";
import { X } from "lucide-react";
import type { PropertyQuery } from "@/lib/types/property";
import type { Zone } from "@/lib/types/zone";
import { buildPropertyQueryString } from "@/lib/validation/search-params";
import { formatPrice } from "@/lib/utils/format";

export function ActiveFilters({ query, zones }: { query: PropertyQuery; zones: Zone[] }) {
  const chips: { key: string; label: string; without: PropertyQuery }[] = [];
  const { page: _page, ...rest } = query;
  void _page;

  if (query.operation) {
    chips.push({
      key: "operation",
      label: query.operation === "venta" ? "Venta" : "Arriendo",
      without: { ...rest, operation: undefined },
    });
  }
  if (query.zoneSlug) {
    const zone = zones.find((z) => z.slug === query.zoneSlug);
    chips.push({
      key: "zone",
      label: zone?.name ?? query.zoneSlug,
      without: { ...rest, zoneSlug: undefined },
    });
  }
  if (query.type) {
    chips.push({ key: "type", label: query.type, without: { ...rest, type: undefined } });
  }
  if (query.bedrooms) {
    chips.push({
      key: "bedrooms",
      label: `${query.bedrooms}+ dormitorios`,
      without: { ...rest, bedrooms: undefined },
    });
  }
  if (query.minPrice) {
    chips.push({
      key: "min",
      label: `Desde ${formatPrice({ amount: query.minPrice, currency: query.operation === "arriendo" ? "CLP" : "UF" })}`,
      without: { ...rest, minPrice: undefined },
    });
  }
  if (query.maxPrice) {
    chips.push({
      key: "max",
      label: `Hasta ${formatPrice({ amount: query.maxPrice, currency: query.operation === "arriendo" ? "CLP" : "UF" })}`,
      without: { ...rest, maxPrice: undefined },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={`/propiedades${buildPropertyQueryString(chip.without)}`}
          className="group inline-flex items-center gap-1.5 rounded-pill border border-cream-50/15 bg-ink-900 px-3 py-1.5 text-xs text-cream-50 transition-colors hover:border-gold-500/50"
        >
          {chip.label}
          <X className="size-3.5 text-muted-400 transition-colors group-hover:text-gold-400" aria-hidden />
        </Link>
      ))}
    </div>
  );
}
