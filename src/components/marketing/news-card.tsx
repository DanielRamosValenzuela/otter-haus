import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import type { NewsArticle } from "@/lib/types/news";
import { formatDate } from "@/lib/utils/format";

export function NewsCard({
  article,
  authorName,
  authorPhotoUrl,
  priority = false,
}: {
  article: NewsArticle;
  authorName: string;
  authorPhotoUrl: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group block overflow-hidden rounded-card border border-cream-50/10 bg-ink-900 transition-[transform,box-shadow] duration-300 ease-lux hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-gold-500/30">
          <Image src={authorPhotoUrl} alt={authorName} fill sizes="36px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-cream-50">{authorName}</p>
          <p className="text-xs text-muted-400">{formatDate(article.publishedAt)}</p>
        </div>
      </div>

      <div className="scrim-scope relative aspect-square overflow-hidden bg-ink-800">
        {article.coverImage ? (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            fill
            priority={priority}
            sizes="(min-width: 640px) 470px, 100vw"
            className="object-cover transition-transform duration-500 ease-lux group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Newspaper className="size-10 text-muted-500" aria-hidden />
          </div>
        )}
      </div>

      <div className="space-y-1.5 p-4">
        <p className="text-sm leading-snug text-cream-50">
          <span className="font-semibold">{authorName}</span>{" "}
          <span className="text-cream-50/85">{article.title}</span>
        </p>
        <p className="line-clamp-2 text-sm text-muted-400">{article.excerpt}</p>
      </div>
    </Link>
  );
}
