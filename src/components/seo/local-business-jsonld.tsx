import { SITE } from "@/lib/content/site";
import { getAgent } from "@/lib/data/agent";

export async function LocalBusinessJsonLd() {
  const agent = await getAgent();

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/image/logo-icon.png`,
    telephone: agent.phone,
    email: agent.email,
    areaServed: [
      { "@type": "City", name: "Santiago" },
      { "@type": "Country", name: "Chile" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
