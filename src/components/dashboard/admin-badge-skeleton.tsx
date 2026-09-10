import { Skeleton } from "@/components/ui/skeleton";

export function AdminBadgeSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="space-y-1.5 text-right">
        <Skeleton className="ml-auto h-3.5 w-24" />
        <Skeleton className="ml-auto h-3 w-32" />
      </div>
      <Skeleton className="size-9 rounded-full" />
    </div>
  );
}
