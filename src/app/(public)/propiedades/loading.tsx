import { Skeleton } from "@/components/ui/skeleton";
import { PropertyGridSkeleton } from "@/components/property/property-grid-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <PropertyGridSkeleton n={9} />
    </div>
  );
}
