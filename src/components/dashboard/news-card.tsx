"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Newspaper } from "lucide-react";
import type { NewsArticle } from "@/lib/types/news";
import { deleteNewsAction, toggleNewsPublishedAction } from "@/lib/actions/news";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";

export function NewsCard({ article }: { article: NewsArticle }) {
  const [pending, startTransition] = useTransition();

  function handleTogglePublished() {
    startTransition(async () => {
      await toggleNewsPublishedAction(article.id, !article.published);
      toast.success(article.published ? "Noticia despublicada" : "Noticia publicada");
    });
  }

  async function handleDelete() {
    await deleteNewsAction(article.id);
    toast.success("Noticia eliminada");
  }

  return (
    <div className="group overflow-hidden rounded-card border border-cream-50/10 bg-ink-900 transition-[transform,box-shadow] duration-300 ease-lux hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-video overflow-hidden bg-ink-800">
        {article.coverImage ? (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 ease-lux group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Newspaper className="size-10 text-muted-500" aria-hidden />
          </div>
        )}
        <div className="absolute left-3 top-3">
          {article.published ? (
            <Badge tone="success">Publicada</Badge>
          ) : (
            <Badge tone="neutral">Borrador</Badge>
          )}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-2 font-display text-lg font-semibold text-cream-50">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-400">{article.excerpt}</p>
        </div>

        {article.published && (
          <p className="text-xs text-muted-400">{formatDate(article.publishedAt)}</p>
        )}

        <div className="flex items-center justify-end gap-1 border-t border-cream-50/10 pt-3">
          <button
            onClick={handleTogglePublished}
            disabled={pending}
            title={article.published ? "Despublicar" : "Publicar"}
            className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50 disabled:opacity-50"
          >
            {article.published ? (
              <Eye className="size-4" aria-hidden />
            ) : (
              <EyeOff className="size-4" aria-hidden />
            )}
          </button>

          <Link
            href={`/dashboard/noticias/${article.id}/editar`}
            title="Editar"
            className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <ConfirmDialog
            title={`¿Eliminar "${article.title}"?`}
            description="Esta acción no se puede deshacer. La noticia se eliminará permanentemente."
            confirmLabel="Eliminar"
            destructive
            onConfirm={handleDelete}
            trigger={
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Eliminar"
                  className="size-8 p-0 text-muted-400 hover:bg-danger-500/15 hover:text-danger-500"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </DialogTrigger>
            }
          />
        </div>
      </div>
    </div>
  );
}
