import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { listZones } from "@/lib/data/zones";
import { createPropertyAction } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/dashboard/property-form";

export const metadata: Metadata = { title: "Nueva propiedad" };
export const instant = false;

export default async function NuevaPropiedadPage() {
  await getCurrentAdmin();
  const zones = await listZones();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Nueva propiedad</h1>
      <PropertyForm mode="create" zones={zones} action={createPropertyAction} />
    </div>
  );
}
