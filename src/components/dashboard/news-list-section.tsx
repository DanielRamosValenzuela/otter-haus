import { getCurrentAdmin } from "@/lib/auth/dal";
import { listAllNewsForAdmin } from "@/lib/data/news";
import { NewsGrid } from "@/components/dashboard/news-grid";

export async function NewsListSection() {
  await getCurrentAdmin();
  const articles = await listAllNewsForAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Mis noticias</h1>
        <p className="text-sm text-muted-400">{articles.length} en total</p>
      </div>
      <NewsGrid articles={articles} />
    </div>
  );
}
