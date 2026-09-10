"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import {
  createNewsArticle,
  deleteNewsArticle,
  setNewsArticlePublished,
  updateNewsArticle,
} from "@/lib/data/news";
import { parseNewsFormData, type NewsFormValues } from "@/lib/validation/news-schema";
import type { ActionState } from "@/lib/types/action-state";
import type { NewsArticle, NewsArticleInput } from "@/lib/types/news";

function toNewsInput(values: NewsFormValues): NewsArticleInput {
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

function invalidateNewsCaches(article?: NewsArticle) {
  updateTag("news");
  if (article) updateTag(`news:${article.slug}`);
  refresh();
}

export async function createNewsAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseNewsFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toNewsInput(parsed.data);
  const article = await createNewsArticle(input);
  invalidateNewsCaches(article);
  redirect("/dashboard/noticias?toast=creada");
}

export async function updateNewsAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

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
  await requireAdmin();
  await deleteNewsArticle(id);
  invalidateNewsCaches();
}

export async function toggleNewsPublishedAction(id: string, published: boolean): Promise<void> {
  await requireAdmin();
  const article = await setNewsArticlePublished(id, published);
  invalidateNewsCaches(article);
}
