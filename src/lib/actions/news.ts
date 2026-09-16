"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";
import {
  createNewsArticle,
  deleteNewsArticle,
  getNewsArticleByIdForAdmin,
  setNewsArticlePublished,
  updateNewsArticle,
} from "@/lib/data/news";
import { parseNewsFormData, type NewsFormValues } from "@/lib/validation/news-schema";
import type { ActionState } from "@/lib/types/action-state";
import type { AdminUser } from "@/lib/types/session";
import type { NewsArticle, NewsArticleInput } from "@/lib/types/news";

function toNewsInput(values: NewsFormValues): Omit<NewsArticleInput, "createdBy"> {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content: values.content,
    coverImage: values.coverImageUrl
      ? { url: values.coverImageUrl, alt: values.coverImageAlt! }
      : undefined,
    published: values.published,
  };
}

async function requireOwnedNews(id: string, actor: AdminUser): Promise<NewsArticle> {
  const article = await getNewsArticleByIdForAdmin(id);
  if (!article) throw new Error("Noticia no encontrada");
  if (actor.role !== "admin" && article.createdBy !== actor.id) {
    throw new Error("No autorizado");
  }
  return article;
}

function invalidateNewsCaches(article?: NewsArticle) {
  updateTag("news");
  if (article) updateTag(`news:${article.slug}`);
  refresh();
}

export async function createNewsAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAuth();

  const parsed = parseNewsFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toNewsInput(parsed.data);
  const article = await createNewsArticle({ ...input, createdBy: actor.id });
  invalidateNewsCaches(article);
  redirect("/dashboard/noticias?toast=creada");
}

export async function updateNewsAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAuth();
  await requireOwnedNews(id, actor);

  const parsed = parseNewsFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toNewsInput(parsed.data);
  const article = await updateNewsArticle(id, input);
  invalidateNewsCaches(article);
  return { status: "success", message: "Noticia actualizada." };
}

export async function deleteNewsAction(id: string): Promise<void> {
  const actor = await requireAuth();
  await requireOwnedNews(id, actor);
  await deleteNewsArticle(id);
  invalidateNewsCaches();
}

export async function toggleNewsPublishedAction(id: string, published: boolean): Promise<void> {
  const actor = await requireAuth();
  await requireOwnedNews(id, actor);
  const article = await setNewsArticlePublished(id, published);
  invalidateNewsCaches(article);
}
