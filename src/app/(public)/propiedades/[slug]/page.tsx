import { Suspense } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { getPropertyBySlug, listProperties } from "@/lib/data/properties";
import { PropertyDetail } from "@/components/property/property-detail";
import { PropertyDetailSkeleton } from "@/components/property/property-detail-skeleton";
import { PageTransition } from "@/components/motion/page-transition";
import { PropertyJsonLd } from "@/components/seo/property-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { formatPrice } from "@/lib/utils/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { items } = await listProperties({ perPage: 1000 });
  return items.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Propiedad no encontrada" };

  const description = `${property.operation === "venta" ? "En venta" : "En arriendo"} — ${formatPrice(property.price)} · ${property.location.commune}, ${property.location.zone}.`;

  return {
    title: property.title,
    description,
    alternates: { canonical: `/propiedades/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      images: property.images[0] ? [{ url: property.images[0].url }] : undefined,
    },
  };
}

export default function PropertyPage({ params }: { params: Params }) {
  return (
    <PageTransition>
      <Suspense fallback={null}>
        <PropertyJsonLdSection params={params} />
      </Suspense>
      <Suspense fallback={<PropertyDetailSkeleton />}>
        <ViewTransition enter="slide-up" default="none">
          <PropertyDetail params={params} />
        </ViewTransition>
      </Suspense>
    </PageTransition>
  );
}

async function PropertyJsonLdSection({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return null;
  return (
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Propiedades", path: "/propiedades" },
          { name: property.title, path: `/propiedades/${property.slug}` },
        ]}
      />
    </>
  );
}
