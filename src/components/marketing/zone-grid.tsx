import { listZones } from "@/lib/data/zones";
import { ZoneCard } from "@/components/marketing/zone-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export async function ZoneGrid() {
  const zones = await listZones();

  return (
    <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {zones.map((zone) => (
        <StaggerItem key={zone.slug}>
          <ZoneCard zone={zone} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
