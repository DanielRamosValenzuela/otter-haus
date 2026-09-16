import { SITE } from "@/lib/content/site";
import type { NewsArticle } from "@/lib/types/news";

export function NewsArticleJsonLd({
  article,
  authorName,
}: {
  article: NewsArticle;
  authorName: string;
}) {
  const url = `${SITE.url}/noticias/${article.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage.url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/image/logo-icon.png` },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
