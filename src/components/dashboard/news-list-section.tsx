import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentAccount } from "@/lib/auth/dal";
import { listAllNewsForAdmin } from "@/lib/data/news";
import { NewsGrid } from "@/components/dashboard/news-grid";
import { Button } from "@/components/ui/button";

export async function NewsListSection() {
  const account = await getCurrentAccount();
  const articles = await listAllNewsForAdmin(account.role === "admin" ? undefined : account.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Mis noticias</h1>
          <p className="text-sm text-muted-400">{articles.length} en total</p>
        </div>
        <Button as={Link} href="/dashboard/noticias/nueva" size="sm">
          <Plus className="size-4" aria-hidden />
          Nueva noticia
        </Button>
      </div>
      <NewsGrid articles={articles} />
    </div>
  );
}
