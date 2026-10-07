import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { getNewsArticleBySlug, listPublishedNews } from "@/lib/data/news";
import { getAgent } from "@/lib/data/agent";
import { PageTransition } from "@/components/motion/page-transition";
import { NewsArticleJsonLd } from "@/components/seo/news-article-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { RichText } from "@/components/ui/rich-text";
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
    alternates: { canonical: `/noticias/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
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

  const byline =
    article.author?.isSubAdmin && article.author.slug
      ? { name: article.author.name, href: `/equipo/${article.author.slug}` }
      : { name: (await getAgent()).name, href: "/nosotros" };

  return (
    <article>
      <NewsArticleJsonLd article={article} authorName={byline.name} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Noticias", path: "/noticias" },
          { name: article.title, path: `/noticias/${article.slug}` },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          {formatDate(article.publishedAt)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        {article.coverImage && (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            width={1200}
            height={800}
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            style={{ width: "100%", height: "auto" }}
            className="mt-8 rounded-card"
          />
        )}

        <RichText
          text={article.content}
          className="mt-8 space-y-5 text-lg leading-relaxed text-cream-50/90"
        />

        <p className="mt-10 border-t border-cream-50/10 pt-6 text-sm text-muted-400">
          Publicado por{" "}
          <Link href={byline.href} className="font-medium text-cream-50 hover:text-gold-400">
            {byline.name}
          </Link>
        </p>

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
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="mt-8 aspect-[3/2] w-full rounded-card" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
}
