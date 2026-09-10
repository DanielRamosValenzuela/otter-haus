import { ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, Ruler } from "lucide-react";
import type { Property } from "@/lib/types/property";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { formatArea } from "@/lib/utils/format";

const STATUS_LABEL: Record<Property["status"], string> = {
  disponible: "Disponible",
  reservada: "Reservada",
  cerrada: "Cerrada",
};

export function PropertyCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const cover = property.images[0];

  return (
    <Link
      href={`/propiedades/${property.slug}`}
      transitionTypes={["nav-forward"]}
      className="group block overflow-hidden rounded-card border border-cream-50/10 bg-ink-900 transition-[transform,box-shadow] duration-300 ease-lux hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="scrim-scope relative aspect-[4/3] overflow-hidden">
        <ViewTransition name={`property-${property.id}`} share="morph" default="none">
          {cover && (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 ease-lux group-hover:scale-105"
            />
          )}
        </ViewTransition>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone="gold">{property.operation === "venta" ? "Venta" : "Arriendo"}</Badge>
          {property.status !== "disponible" && (
            <Badge tone={property.status === "reservada" ? "warning" : "neutral"}>
              {STATUS_LABEL[property.status]}
            </Badge>
          )}
        </div>
        {property.featured && (
          <div className="absolute right-3 top-3">
            <Badge tone="neutral" className="bg-scrim/70">
              Destacada
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-cream-50">
            {property.title}
          </h3>
          <p className="text-sm text-muted-400">
            {property.location.commune} · {property.location.zone}
          </p>
        </div>

        <Price price={property.price} />

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-400">
          {property.features.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bed className="size-4" aria-hidden />
              {property.features.bedrooms}
            </span>
          )}
          {property.features.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="size-4" aria-hidden />
              {property.features.bathrooms}
            </span>
          )}
          {property.features.parkingSpaces > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Car className="size-4" aria-hidden />
              {property.features.parkingSpaces}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="size-4" aria-hidden />
            {formatArea(property.features.builtAreaM2 || property.features.landAreaM2 || 0)}
          </span>
        </div>
      </div>
    </Link>
  );
}
