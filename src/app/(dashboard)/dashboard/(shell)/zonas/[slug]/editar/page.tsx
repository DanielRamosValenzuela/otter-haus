import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { getZoneForAdmin } from "@/lib/data/zones";
import { updateZoneAction } from "@/lib/actions/zones";
import { ZoneForm } from "@/components/dashboard/zone-form";

export const metadata: Metadata = { title: "Editar zona" };
export const instant = false;

export default async function EditarZonaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await getCurrentAdmin();
  const { slug } = await params;

  const zone = await getZoneForAdmin(slug);
  if (!zone) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Editar zona</h1>
      <ZoneForm mode="edit" zone={zone} action={updateZoneAction.bind(null, zone.slug)} />
    </div>
  );
}
