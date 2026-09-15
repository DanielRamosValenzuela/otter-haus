import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import { slugify } from "@/lib/utils/format";
import type { NewsArticle, NewsArticleInput } from "@/lib/types/news";

interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

function rowToNews(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage:
      row.cover_image_url != null
        ? { url: row.cover_image_url, alt: row.cover_image_alt ?? "" }
        : undefined,
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedNews(limit?: number): Promise<NewsArticle[]> {
  "use cache";
  cacheTag("news");
  cacheLife("hours");

  const rows = await sql`
    SELECT * FROM news_articles WHERE published = true ORDER BY published_at DESC
  `;
  const items = (rows as NewsRow[]).map(rowToNews);
  return limit != null ? items.slice(0, limit) : items;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheTag("news");
  cacheTag(`news:${slug}`);
  cacheLife("hours");

  const rows = await sql`SELECT * FROM news_articles WHERE slug = ${slug}`;
  if (rows.length === 0 || !(rows[0] as NewsRow).published) return null;
  return rowToNews(rows[0] as NewsRow);
}

export async function listAllNewsForAdmin(): Promise<NewsArticle[]> {
  const rows = await sql`SELECT * FROM news_articles ORDER BY published_at DESC`;
  return (rows as NewsRow[]).map(rowToNews);
}

export async function getNewsArticleByIdForAdmin(id: string): Promise<NewsArticle | null> {
  const rows = await sql`SELECT * FROM news_articles WHERE id = ${id}`;
  return rows.length > 0 ? rowToNews(rows[0] as NewsRow) : null;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "noticia";
  let candidate = root;
  let n = 2;
  for (;;) {
    const rows = await sql`
      SELECT 1 FROM news_articles WHERE slug = ${candidate} AND id IS DISTINCT FROM ${ignoreId ?? null}
    `;
    if (rows.length === 0) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

export async function createNewsArticle(input: NewsArticleInput): Promise<NewsArticle> {
  const id = `news-${crypto.randomUUID()}`;
  const slug = await uniqueSlug(input.slug || input.title);

  const rows = await sql`
    INSERT INTO news_articles (id, slug, title, excerpt, content, cover_image_url, cover_image_alt, published, published_at)
    VALUES (
      ${id}, ${slug}, ${input.title}, ${input.excerpt}, ${input.content},
      ${input.coverImage?.url ?? null}, ${input.coverImage?.alt ?? null}, ${input.published}, now()
    )
    RETURNING *
  `;
  return rowToNews(rows[0] as NewsRow);
}

export async function updateNewsArticle(id: string, input: NewsArticleInput): Promise<NewsArticle> {
  const slug = input.slug ? await uniqueSlug(input.slug, id) : undefined;

  const rows = await sql`
    UPDATE news_articles SET
      slug = COALESCE(${slug ?? null}, slug),
      title = ${input.title},
      excerpt = ${input.excerpt},
      content = ${input.content},
      cover_image_url = ${input.coverImage?.url ?? null},
      cover_image_alt = ${input.coverImage?.alt ?? null},
      published = ${input.published},
      published_at = CASE WHEN published = false AND ${input.published} = true THEN now() ELSE published_at END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) throw new Error(`Noticia ${id} no encontrada`);
  return rowToNews(rows[0] as NewsRow);
}

export async function deleteNewsArticle(id: string): Promise<void> {
  await sql`DELETE FROM news_articles WHERE id = ${id}`;
}

export async function setNewsArticlePublished(id: string, published: boolean): Promise<NewsArticle> {
  const rows = await sql`
    UPDATE news_articles SET
      published = ${published},
      published_at = CASE WHEN published = false AND ${published} = true THEN now() ELSE published_at END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) throw new Error(`Noticia ${id} no encontrada`);
  return rowToNews(rows[0] as NewsRow);
}
