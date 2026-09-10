import { Skeleton } from "@/components/ui/skeleton";

export function ZoneGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] sm:aspect-square" />
      ))}
    </div>
  );
}
