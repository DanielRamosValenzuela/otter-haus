import type { NewsArticle } from "@/lib/types/news";
import { NewsCard } from "@/components/dashboard/news-card";
import { EmptyState } from "@/components/ui/empty-state";

export function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay noticias"
        description="Crea tu primera noticia con el botón “Nueva noticia”."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
