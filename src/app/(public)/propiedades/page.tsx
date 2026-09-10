import { Suspense } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { CatalogResults } from "@/components/property/catalog-results";
import { PropertyGridSkeleton } from "@/components/property/property-grid-skeleton";
import { PageTransition } from "@/components/motion/page-transition";
import type { RawSearchParams } from "@/lib/validation/search-params";

export const metadata: Metadata = {
  title: "Propiedades",
  description: "Explora nuestro catálogo de propiedades en venta y arriendo en Santiago.",
};

export default function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h1 className="font-display text-4xl font-semibold">Propiedades</h1>
          <p className="text-muted-400">
            Explora el catálogo completo en venta y arriendo, filtrado por zona, tipo y precio.
          </p>
        </div>

        <Suspense fallback={<PropertyGridSkeleton n={9} />}>
          <ViewTransition enter="slide-up" default="none">
            <CatalogResults searchParams={searchParams} />
          </ViewTransition>
        </Suspense>
      </div>
    </PageTransition>
  );
}
