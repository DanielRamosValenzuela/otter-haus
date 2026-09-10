import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { getNewsArticleBySlug, listPublishedNews } from "@/lib/data/news";
import { PageTransition } from "@/components/motion/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const articles = await listPublishedNews();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return { title: "Noticia no encontrada" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [{ url: article.coverImage.url }] : undefined,
    },
  };
}

export default function NewsArticlePage({ params }: { params: Params }) {
  return (
    <PageTransition>
      <Suspense fallback={<NewsArticleSkeleton />}>
        <NewsArticleContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function NewsArticleContent({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <article>
      <div className="scrim-scope relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-ink-800 to-ink-900 sm:aspect-[21/9]">
        {article.coverImage && (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              {formatDate(article.publishedAt)}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-5 text-lg leading-relaxed text-cream-50/90">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <Link
          href="/noticias"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-muted-400 transition-colors hover:text-gold-400"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Volver a noticias
        </Link>
      </div>
    </article>
  );
}

function NewsArticleSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-none sm:aspect-[21/9]" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  );
}
