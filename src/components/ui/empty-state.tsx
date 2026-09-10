import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-cream-50/10 bg-ink-900/50 px-6 py-16 text-center">
      <SearchX aria-hidden className="size-10 text-muted-500" />
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        {description && <p className="text-muted-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
