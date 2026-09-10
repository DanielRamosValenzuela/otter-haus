import { Suspense } from "react";
import type { Metadata } from "next";
import { NewsListSection } from "@/components/dashboard/news-list-section";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { ToastOnMount } from "@/components/dashboard/toast-on-mount";

export const metadata: Metadata = { title: "Mis noticias" };

export const instant = false;

export default async function DashboardNoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const { toast } = await searchParams;

  return (
    <>
      {toast === "creada" && <ToastOnMount message="Noticia creada." />}
      <Suspense fallback={<TableSkeleton />}>
        <NewsListSection />
      </Suspense>
    </>
  );
}
