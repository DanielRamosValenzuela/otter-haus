import "server-only";
import { randomUUID } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import type { HomeContent, HomeContentInput, ValuePropItem } from "@/lib/types/home-content";

interface HomeContentRow {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_label: string;
  hero_primary_cta_href: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_href: string;
  hero_mobile_image_url: string;
  hero_mobile_image_alt: string;
  zone_visible: boolean;
  zone_eyebrow: string;
  zone_title: string;
  zone_description: string;
  featured_visible: boolean;
  featured_eyebrow: string;
  featured_title: string;
  featured_description: string;
  value_visible: boolean;
  value_eyebrow: string;
  value_title: string;
  team_visible: boolean;
  team_single_eyebrow: string;
  team_single_cta_label: string;
  team_eyebrow: string;
  team_title: string;
  team_cta_label: string;
  footer_description: string;
  updated_at: string;
}

function rowToHomeContent(row: HomeContentRow, items: ValuePropItem[]): HomeContent {
  return {
    hero: {
      badge: row.hero_badge,
      title: row.hero_title,
      subtitle: row.hero_subtitle,
      primaryCtaLabel: row.hero_primary_cta_label,
      primaryCtaHref: row.hero_primary_cta_href,
      secondaryCtaLabel: row.hero_secondary_cta_label,
      secondaryCtaHref: row.hero_secondary_cta_href,
      mobileImageUrl: row.hero_mobile_image_url,
      mobileImageAlt: row.hero_mobile_image_alt,
    },
    zoneSection: {
      visible: row.zone_visible,
      eyebrow: row.zone_eyebrow,
      title: row.zone_title,
      description: row.zone_description,
    },
    featuredSection: {
      visible: row.featured_visible,
      eyebrow: row.featured_eyebrow,
      title: row.featured_title,
      description: row.featured_description,
    },
    valueSection: {
      visible: row.value_visible,
      eyebrow: row.value_eyebrow,
      title: row.value_title,
      items,
    },
    teamSection: {
      visible: row.team_visible,
      singleEyebrow: row.team_single_eyebrow,
      singleCtaLabel: row.team_single_cta_label,
      teamEyebrow: row.team_eyebrow,
      teamTitle: row.team_title,
      teamCtaLabel: row.team_cta_label,
    },
    footerDescription: row.footer_description,
    updatedAt: row.updated_at,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag("home-content");
  cacheLife("days");

  const [rows, items] = await Promise.all([
    sql`SELECT * FROM home_content LIMIT 1`,
    sql`SELECT id, icon, title, description FROM home_value_props ORDER BY position`,
  ]);
  if (rows.length === 0) throw new Error("No hay contenido de home configurado.");
  return rowToHomeContent(rows[0] as HomeContentRow, items as ValuePropItem[]);
}

export async function updateHomeContent(input: HomeContentInput): Promise<void> {
  const [updated] = await sql.transaction([
    sql`
      UPDATE home_content SET
        hero_badge = ${input.hero.badge},
        hero_title = ${input.hero.title},
        hero_subtitle = ${input.hero.subtitle},
        hero_primary_cta_label = ${input.hero.primaryCtaLabel},
        hero_primary_cta_href = ${input.hero.primaryCtaHref},
        hero_secondary_cta_label = ${input.hero.secondaryCtaLabel},
        hero_secondary_cta_href = ${input.hero.secondaryCtaHref},
        hero_mobile_image_url = ${input.hero.mobileImageUrl},
        hero_mobile_image_alt = ${input.hero.mobileImageAlt},
        zone_visible = ${input.zoneSection.visible},
        zone_eyebrow = ${input.zoneSection.eyebrow},
        zone_title = ${input.zoneSection.title},
        zone_description = ${input.zoneSection.description},
        featured_visible = ${input.featuredSection.visible},
        featured_eyebrow = ${input.featuredSection.eyebrow},
        featured_title = ${input.featuredSection.title},
        featured_description = ${input.featuredSection.description},
        value_visible = ${input.valueSection.visible},
        value_eyebrow = ${input.valueSection.eyebrow},
        value_title = ${input.valueSection.title},
        team_visible = ${input.teamSection.visible},
        team_single_eyebrow = ${input.teamSection.singleEyebrow},
        team_single_cta_label = ${input.teamSection.singleCtaLabel},
        team_eyebrow = ${input.teamSection.teamEyebrow},
        team_title = ${input.teamSection.teamTitle},
        team_cta_label = ${input.teamSection.teamCtaLabel},
        footer_description = ${input.footerDescription},
        updated_at = now()
      RETURNING id
    `,
    sql`DELETE FROM home_value_props`,
    ...input.valueSection.items.map(
      (item, position) => sql`
        INSERT INTO home_value_props (id, position, icon, title, description)
        VALUES (${item.id ?? `value-${randomUUID()}`}, ${position}, ${item.icon}, ${item.title}, ${item.description})
      `,
    ),
  ]);
  if (updated.length === 0) throw new Error("No hay contenido de home configurado.");
}
