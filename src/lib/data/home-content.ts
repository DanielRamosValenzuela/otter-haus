import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import type { HomeContent, HomeContentInput } from "@/lib/types/home-content";

interface HomeContentRow {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_label: string;
  hero_secondary_cta_label: string;
  zone_eyebrow: string;
  zone_title: string;
  zone_description: string;
  featured_eyebrow: string;
  featured_title: string;
  featured_description: string;
  updated_at: string;
}

function rowToHomeContent(row: HomeContentRow): HomeContent {
  return {
    hero: {
      badge: row.hero_badge,
      title: row.hero_title,
      subtitle: row.hero_subtitle,
      primaryCtaLabel: row.hero_primary_cta_label,
      secondaryCtaLabel: row.hero_secondary_cta_label,
    },
    zoneSection: {
      eyebrow: row.zone_eyebrow,
      title: row.zone_title,
      description: row.zone_description,
    },
    featuredSection: {
      eyebrow: row.featured_eyebrow,
      title: row.featured_title,
      description: row.featured_description,
    },
    updatedAt: row.updated_at,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag("home-content");
  cacheLife("days");

  const rows = await sql`SELECT * FROM home_content LIMIT 1`;
  if (rows.length === 0) throw new Error("No hay contenido de home configurado.");
  return rowToHomeContent(rows[0] as HomeContentRow);
}

export async function updateHomeContent(input: HomeContentInput): Promise<HomeContent> {
  const rows = await sql`
    UPDATE home_content SET
      hero_badge = ${input.hero.badge},
      hero_title = ${input.hero.title},
      hero_subtitle = ${input.hero.subtitle},
      hero_primary_cta_label = ${input.hero.primaryCtaLabel},
      hero_secondary_cta_label = ${input.hero.secondaryCtaLabel},
      zone_eyebrow = ${input.zoneSection.eyebrow},
      zone_title = ${input.zoneSection.title},
      zone_description = ${input.zoneSection.description},
      featured_eyebrow = ${input.featuredSection.eyebrow},
      featured_title = ${input.featuredSection.title},
      featured_description = ${input.featuredSection.description},
      updated_at = now()
    RETURNING *
  `;
  if (rows.length === 0) throw new Error("No hay contenido de home configurado.");
  return rowToHomeContent(rows[0] as HomeContentRow);
}
