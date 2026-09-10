import { getFeaturedProperties } from "@/lib/data/properties";
import { PropertyCard } from "@/components/property/property-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties(4);
  if (properties.length === 0) return null;

  return (
    <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {properties.map((property) => (
        <StaggerItem key={property.id}>
          <PropertyCard property={property} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
