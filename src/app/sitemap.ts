import type { MetadataRoute } from "next";
import { listProperties } from "@/lib/data/properties";
import { listSubAdmins } from "@/lib/data/admin";
import { SITE } from "@/lib/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items }, subAdmins] = await Promise.all([
    listProperties({ perPage: 1000 }),
    listSubAdmins(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/nosotros`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/guia-legal`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/contacto`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const propertyPages: MetadataRoute.Sitemap = items.map((property) => ({
    url: `${SITE.url}/propiedades/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const teamPages: MetadataRoute.Sitemap = subAdmins
    .filter((account) => account.active && account.slug)
    .map((account) => ({
      url: `${SITE.url}/equipo/${account.slug}`,
      changeFrequency: "monthly",
      priority: 0.4,
    }));

  return [...staticPages, ...propertyPages, ...teamPages];
}
