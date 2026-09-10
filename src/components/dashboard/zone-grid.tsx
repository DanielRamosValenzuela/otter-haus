import type { Zone } from "@/lib/types/zone";
import { ZoneCard } from "@/components/dashboard/zone-card";
import { EmptyState } from "@/components/ui/empty-state";

export function ZoneGrid({ zones }: { zones: Zone[] }) {
  if (zones.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay zonas"
        description="Crea tu primera zona con el botón “Nueva zona”."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {zones.map((zone) => (
        <ZoneCard key={zone.slug} zone={zone} />
      ))}
    </div>
  );
}
