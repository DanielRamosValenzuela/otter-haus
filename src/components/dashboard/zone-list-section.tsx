import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { listZones } from "@/lib/data/zones";
import { ZoneGrid } from "@/components/dashboard/zone-grid";
import { Button } from "@/components/ui/button";

export async function ZoneListSection() {
  await requireAdminPage();
  const zones = await listZones();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Mis zonas</h1>
          <p className="text-sm text-muted-400">{zones.length} en total</p>
        </div>
        <Button as={Link} href="/dashboard/zonas/nueva" size="sm">
          <Plus className="size-4" aria-hidden />
          Nueva zona
        </Button>
      </div>
      <ZoneGrid zones={zones} />
    </div>
  );
}
