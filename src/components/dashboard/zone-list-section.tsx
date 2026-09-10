import { getCurrentAdmin } from "@/lib/auth/dal";
import { listZones } from "@/lib/data/zones";
import { ZoneGrid } from "@/components/dashboard/zone-grid";

export async function ZoneListSection() {
  await getCurrentAdmin();
  const zones = await listZones();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Mis zonas</h1>
        <p className="text-sm text-muted-400">{zones.length} en total</p>
      </div>
      <ZoneGrid zones={zones} />
    </div>
  );
}
