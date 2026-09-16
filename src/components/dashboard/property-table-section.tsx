import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentAccount } from "@/lib/auth/dal";
import { listAllPropertiesForAdmin } from "@/lib/data/properties";
import { PropertyTable } from "@/components/dashboard/property-table";
import { Button } from "@/components/ui/button";

export async function PropertyTableSection() {
  const account = await getCurrentAccount();
  const properties = await listAllPropertiesForAdmin(
    account.role === "admin" ? undefined : account.id,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Mis propiedades</h1>
          <p className="text-sm text-muted-400">{properties.length} en total</p>
        </div>
        <Button as={Link} href="/dashboard/propiedades/nueva" size="sm">
          <Plus className="size-4" aria-hidden />
          Nueva propiedad
        </Button>
      </div>
      <PropertyTable properties={properties} />
    </div>
  );
}
