import { Skeleton } from "@/components/ui/skeleton";
import { NewsFeedSkeleton } from "@/components/marketing/news-feed-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <NewsFeedSkeleton n={3} />
    </div>
  );
}
