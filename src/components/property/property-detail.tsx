import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPropertyBySlug } from "@/lib/data/properties";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertySpecs } from "@/components/property/property-specs";
import { PropertyContactCard } from "@/components/property/property-contact-card";
import { RelatedProperties } from "@/components/property/related-properties";

const STATUS_LABEL = { disponible: "Disponible", reservada: "Reservada", cerrada: "Cerrada" } as const;

export async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/propiedades"
        transitionTypes={["nav-back"]}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-400 transition-colors hover:text-gold-400"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">{property.operation === "venta" ? "Venta" : "Arriendo"}</Badge>
              {property.status !== "disponible" && (
                <Badge tone={property.status === "reservada" ? "warning" : "neutral"}>
                  {STATUS_LABEL[property.status]}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{property.title}</h1>
            <p className="text-muted-400">
              {property.location.addressHint ? `${property.location.addressHint} · ` : ""}
              {property.location.commune}, {property.location.zone}
            </p>
            <Price price={property.price} className="text-3xl" />
          </div>

          <PropertyGallery images={property.images} transitionName={`property-${property.id}`} />

          <PropertySpecs property={property} />

          <div>
            <h2 className="font-display text-lg font-semibold">Descripción</h2>
            <p className="mt-3 whitespace-pre-line text-cream-50/90">{property.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PropertyContactCard property={property} />
        </div>
      </div>

      <Suspense fallback={null}>
        <RelatedProperties propertyId={property.id} />
      </Suspense>
    </div>
  );
}
