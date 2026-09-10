import { listPublishedNews } from "@/lib/data/news";
import { getAgent } from "@/lib/data/agent";
import { NewsCard } from "@/components/marketing/news-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export async function NewsFeedSection() {
  const [articles, agent] = await Promise.all([listPublishedNews(), getAgent()]);

  if (articles.length === 0) {
    return (
      <EmptyState
        title="Aún no hay noticias publicadas"
        description="Vuelve pronto para conocer las últimas novedades de TranHaus."
      />
    );
  }

  return (
    <Stagger className="flex max-w-xl flex-col gap-8">
      {articles.map((article, index) => (
        <StaggerItem key={article.id}>
          <NewsCard
            article={article}
            authorName={agent.name}
            authorPhotoUrl={agent.photoUrl}
            priority={index < 2}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
