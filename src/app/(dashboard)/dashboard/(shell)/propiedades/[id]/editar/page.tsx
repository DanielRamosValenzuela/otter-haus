import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { getPropertyByIdForAdmin } from "@/lib/data/properties";
import { listZones } from "@/lib/data/zones";
import { updatePropertyAction } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/dashboard/property-form";

export const metadata: Metadata = { title: "Editar propiedad" };
export const instant = false;

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getCurrentAdmin();
  const { id } = await params;

  const [property, zones] = await Promise.all([getPropertyByIdForAdmin(id), listZones()]);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Editar propiedad</h1>
      <PropertyForm
        mode="edit"
        zones={zones}
        property={property}
        action={updatePropertyAction.bind(null, property.id)}
      />
    </div>
  );
}
