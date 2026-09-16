import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/dal";
import { createZoneAction } from "@/lib/actions/zones";
import { ZoneForm } from "@/components/dashboard/zone-form";

export const metadata: Metadata = { title: "Nueva zona" };
export const instant = false;

export default async function NuevaZonaPage() {
  await requireAdminPage();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Nueva zona</h1>
      <ZoneForm mode="create" action={createZoneAction} />
    </div>
  );
}
