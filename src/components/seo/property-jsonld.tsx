import { SITE } from "@/lib/content/site";
import type { Property } from "@/lib/types/property";

export function PropertyJsonLd({ property }: { property: Property }) {
  const url = `${SITE.url}/propiedades/${property.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description,
    image: property.images.map((image) => image.url),
    url,
    category: property.type,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Dormitorios", value: property.features.bedrooms },
      { "@type": "PropertyValue", name: "Baños", value: property.features.bathrooms },
      {
        "@type": "PropertyValue",
        name: "Superficie construida",
        value: `${property.features.builtAreaM2} m²`,
      },
    ],
    offers: {
      "@type": "Offer",
      price: property.price.amount,
      priceCurrency: property.price.currency,
      availability:
        property.status === "disponible"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
      areaServed: { "@type": "City", name: property.location.commune },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
