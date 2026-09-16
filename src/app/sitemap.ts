import type { MetadataRoute } from "next";
import { listProperties } from "@/lib/data/properties";
import { listPublishedNews } from "@/lib/data/news";
import { listSubAdmins } from "@/lib/data/admin";
import { SITE } from "@/lib/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items }, articles, subAdmins] = await Promise.all([
    listProperties({ perPage: 1000 }),
    listPublishedNews(),
    listSubAdmins(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/noticias`, changeFrequency: "daily", priority: 0.7 },
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

  const newsPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE.url}/noticias/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const teamPages: MetadataRoute.Sitemap = subAdmins
    .filter((account) => account.active && account.slug)
    .map((account) => ({
      url: `${SITE.url}/equipo/${account.slug}`,
      changeFrequency: "monthly",
      priority: 0.4,
    }));

  return [...staticPages, ...propertyPages, ...newsPages, ...teamPages];
}
