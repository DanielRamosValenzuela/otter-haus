import Link from "next/link";
import { Sun, Landmark, TreePine, MapPin, type LucideIcon } from "lucide-react";
import type { Zone } from "@/lib/types/zone";
import { pluralize } from "@/lib/utils/format";
import { ScrollZoomImage } from "@/components/motion/scroll-zoom-image";

const ZONE_ICONS: Record<string, LucideIcon> = {
  "zona-norte": Sun,
  "zona-centro": Landmark,
  "zona-sur": TreePine,
};

export function ZoneCard({ zone }: { zone: Zone }) {
  const Icon = ZONE_ICONS[zone.slug] ?? MapPin;

  return (
    <Link
      href={`/propiedades?zona=${zone.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-card sm:aspect-square"
    >
      {zone.imageUrl && (
        <ScrollZoomImage
          src={zone.imageUrl}
          alt={zone.name}
          sizes="(min-width: 1024px) 320px, 45vw"
          imageClassName="transition-transform duration-500 ease-lux group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-scrim/90 via-scrim/30 to-transparent" />

      <div className="scrim-scope glass absolute inset-x-4 bottom-4 flex flex-col items-center gap-1.5 rounded-card px-4 py-4 text-center text-cream-50 transition-transform duration-300 ease-lux group-hover:-translate-y-1">
        <Icon className="size-6 text-gold-500 transition-transform duration-300 ease-lux group-hover:rotate-6" aria-hidden />
        <span className="font-display text-lg font-semibold uppercase tracking-wide">
          {zone.name}
        </span>
        <span className="text-xs text-muted-400">
          {zone.propertyCount} {pluralize(zone.propertyCount, "propiedad", "propiedades")}
        </span>
      </div>
    </Link>
  );
}
