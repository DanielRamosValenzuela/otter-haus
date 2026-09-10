import { getRelatedProperties } from "@/lib/data/properties";
import { PropertyGrid } from "@/components/property/property-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export async function RelatedProperties({ propertyId }: { propertyId: string }) {
  const properties = await getRelatedProperties(propertyId, 3);
  if (properties.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title="Propiedades similares" />
      <div className="mt-8">
        <PropertyGrid properties={properties} />
      </div>
    </section>
  );
}
