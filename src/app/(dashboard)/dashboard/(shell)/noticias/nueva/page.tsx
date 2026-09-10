import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { createNewsAction } from "@/lib/actions/news";
import { NewsForm } from "@/components/dashboard/news-form";

export const metadata: Metadata = { title: "Nueva noticia" };
export const instant = false;

export default async function NuevaNoticiaPage() {
  await getCurrentAdmin();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Nueva noticia</h1>
      <NewsForm mode="create" action={createNewsAction} />
    </div>
  );
}
