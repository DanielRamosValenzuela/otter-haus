import { getCurrentAdmin } from "@/lib/auth/dal";
import { listAllPropertiesForAdmin } from "@/lib/data/properties";
import { PropertyTable } from "@/components/dashboard/property-table";

export async function PropertyTableSection() {
  await getCurrentAdmin();
  const properties = await listAllPropertiesForAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Mis propiedades</h1>
        <p className="text-sm text-muted-400">{properties.length} en total</p>
      </div>
      <PropertyTable properties={properties} />
    </div>
  );
}
