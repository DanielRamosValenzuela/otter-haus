import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { User } from "lucide-react";
import { getSubAdminBySlug } from "@/lib/data/admin";
import { listPublishedNewsByAuthor } from "@/lib/data/news";
import { NewsCard } from "@/components/marketing/news-card";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

type Params = Promise<{ slug: string }>;

export const instant = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const account = await getSubAdminBySlug(slug);
  if (!account) return { title: "Perfil no encontrado" };

  return {
    title: account.name,
    description: account.bio ?? `Noticias publicadas por ${account.name} en OtterHaus.`,
    alternates: { canonical: `/equipo/${account.slug}` },
  };
}

export default function TeamProfilePage({ params }: { params: Params }) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense fallback={<TeamProfileSkeleton />}>
          <TeamProfileContent params={params} />
        </Suspense>
      </div>
    </PageTransition>
  );
}

async function TeamProfileContent({ params }: { params: Params }) {
  const { slug } = await params;
  const account = await getSubAdminBySlug(slug);
  if (!account) notFound();

  const articles = await listPublishedNewsByAuthor(account.id);

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:items-start">
        <Reveal>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-card bg-ink-800">
            {account.photoUrl ? (
              <Image
                src={account.photoUrl}
                alt={account.name}
                fill
                sizes="(min-width: 1024px) 280px, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <User className="size-16 text-muted-500" aria-hidden />
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{account.name}</h1>
            {account.roleTitle && <p className="mt-1 text-gold-400">{account.roleTitle}</p>}
          </div>
          {account.bio && (
            <p className="max-w-2xl whitespace-pre-line text-cream-50/90">{account.bio}</p>
          )}
        </Reveal>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold">
          Noticias publicadas por {account.name}
        </h2>
        <div className="mt-8">
          {articles.length === 0 ? (
            <EmptyState
              title="Aún no hay noticias"
              description={`${account.name} todavía no ha publicado noticias.`}
            />
          ) : (
            <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <StaggerItem key={article.id}>
                  <NewsCard
                    article={article}
                    authorName={account.name}
                    authorPhotoUrl={account.photoUrl}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
      <Skeleton className="aspect-square rounded-card" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
