import { Skeleton } from "@/components/ui/skeleton";

export function NewsFeedSkeleton({ n = 3 }: { n?: number }) {
  return (
    <div className="flex max-w-xl flex-col gap-8">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-cream-50/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
