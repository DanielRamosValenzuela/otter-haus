export interface NewsArticleImage {
  url: string;
  alt: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: NewsArticleImage;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type NewsArticleInput = Omit<
  NewsArticle,
  "id" | "slug" | "createdAt" | "updatedAt" | "publishedAt"
> & { slug?: string };
