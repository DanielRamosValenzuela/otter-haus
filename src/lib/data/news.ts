import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { readDb, writeDb } from "@/lib/data/json-store";
import { slugify } from "@/lib/utils/format";
import type { NewsArticle, NewsArticleInput } from "@/lib/types/news";

function sortNewsByPublishedAt(items: NewsArticle[]): NewsArticle[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function listPublishedNews(limit?: number): Promise<NewsArticle[]> {
  "use cache";
  cacheTag("news");
  cacheLife("hours");

  const db = await readDb();
  const sorted = sortNewsByPublishedAt(db.news.filter((n) => n.published));
  return limit != null ? sorted.slice(0, limit) : sorted;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheTag("news");
  cacheTag(`news:${slug}`);
  cacheLife("hours");

  const db = await readDb();
  const article = db.news.find((n) => n.slug === slug);
  if (!article || !article.published) return null;
  return article;
}

export async function listAllNewsForAdmin(): Promise<NewsArticle[]> {
  const db = await readDb();
  return sortNewsByPublishedAt(db.news);
}

export async function getNewsArticleByIdForAdmin(id: string): Promise<NewsArticle | null> {
  const db = await readDb();
  return db.news.find((n) => n.id === id) ?? null;
}

function uniqueSlug(base: string, existing: NewsArticle[], ignoreId?: string): string {
  const root = slugify(base) || "noticia";
  let candidate = root;
  let n = 2;
  while (existing.some((n2) => n2.slug === candidate && n2.id !== ignoreId)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createNewsArticle(input: NewsArticleInput): Promise<NewsArticle> {
  let created!: NewsArticle;
  await writeDb((db) => {
    const now = new Date().toISOString();
    const id = `news-${crypto.randomUUID()}`;
    created = {
      ...input,
      id,
      slug: uniqueSlug(input.slug || input.title, db.news),
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    return { ...db, news: [...db.news, created] };
  });
  return created;
}

export async function updateNewsArticle(id: string, input: NewsArticleInput): Promise<NewsArticle> {
  let updated: NewsArticle | null = null;
  await writeDb((db) => {
    const index = db.news.findIndex((n) => n.id === id);
    if (index === -1) throw new Error(`Noticia ${id} no encontrada`);
    const existing = db.news[index];
    const isBecomingPublished = !existing.published && input.published;
    updated = {
      ...existing,
      ...input,
      id: existing.id,
      slug: input.slug ? uniqueSlug(input.slug, db.news, id) : existing.slug,
      publishedAt: isBecomingPublished ? new Date().toISOString() : existing.publishedAt,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const news = [...db.news];
    news[index] = updated;
    return { ...db, news };
  });
  if (!updated) throw new Error(`Noticia ${id} no encontrada`);
  return updated;
}

export async function deleteNewsArticle(id: string): Promise<void> {
  await writeDb((db) => ({
    ...db,
    news: db.news.filter((n) => n.id !== id),
  }));
}

export async function setNewsArticlePublished(id: string, published: boolean): Promise<NewsArticle> {
  let updated: NewsArticle | null = null;
  await writeDb((db) => {
    const index = db.news.findIndex((n) => n.id === id);
    if (index === -1) throw new Error(`Noticia ${id} no encontrada`);
    const existing = db.news[index];
    const isBecomingPublished = !existing.published && published;
    updated = {
      ...existing,
      published,
      publishedAt: isBecomingPublished ? new Date().toISOString() : existing.publishedAt,
      updatedAt: new Date().toISOString(),
    };
    const news = [...db.news];
    news[index] = updated;
    return { ...db, news };
  });
  if (!updated) throw new Error(`Noticia ${id} no encontrada`);
  return updated;
}
