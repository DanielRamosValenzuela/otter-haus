import { Suspense } from "react";
import type { Metadata } from "next";
import { NewsFeedSection } from "@/components/marketing/news-feed-section";
import { NewsFeedSkeleton } from "@/components/marketing/news-feed-skeleton";
import { NewsSidebar } from "@/components/marketing/news-sidebar";
import { PageTransition } from "@/components/motion/page-transition";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Novedades del mercado inmobiliario y actualidad de TranHaus.",
};

export default function NoticiasPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="TranHaus"
            title="Noticias"
            description="Tendencias del mercado inmobiliario, consejos y novedades de TranHaus."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Suspense fallback={<NewsFeedSkeleton n={3} />}>
            <NewsFeedSection />
          </Suspense>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Suspense fallback={<Skeleton className="h-80 rounded-card" />}>
                <NewsSidebar />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
