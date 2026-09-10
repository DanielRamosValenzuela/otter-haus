import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { getNewsArticleByIdForAdmin } from "@/lib/data/news";
import { updateNewsAction } from "@/lib/actions/news";
import { NewsForm } from "@/components/dashboard/news-form";

export const metadata: Metadata = { title: "Editar noticia" };
export const instant = false;

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getCurrentAdmin();
  const { id } = await params;

  const article = await getNewsArticleByIdForAdmin(id);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Editar noticia</h1>
      <NewsForm
        mode="edit"
        article={article}
        action={updateNewsAction.bind(null, article.id)}
      />
    </div>
  );
}
