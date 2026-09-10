import Image from "next/image";
import type { Property } from "@/lib/types/property";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PropertyRowActions } from "@/components/dashboard/property-row-actions";
import { EmptyState } from "@/components/ui/empty-state";

export function PropertyTable({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay propiedades"
        description="Crea tu primera propiedad con el botón “Nueva propiedad”."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-cream-50/10">
      <table className="w-full text-sm">
        <thead className="border-b border-cream-50/10 bg-ink-900/60 text-left text-xs uppercase tracking-wide text-muted-400">
          <tr>
            <th className="px-4 py-3 font-medium">Propiedad</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Zona</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Precio</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-50/5">
          {properties.map((property) => (
            <tr key={property.id} className="transition-colors hover:bg-cream-50/[0.03]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                    {property.images[0] && (
                      <Image
                        src={property.images[0].url}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-cream-50">{property.title}</p>
                    <p className="text-xs text-muted-400">
                      {property.operation === "venta" ? "Venta" : "Arriendo"} ·{" "}
                      {property.location.commune}
                    </p>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-muted-400 sm:table-cell">
                {property.location.zone}
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <Price price={property.price} className="text-sm" />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge status={property.status} />
                  {!property.published && <Badge tone="neutral">Borrador</Badge>}
                  {property.featured && <Badge tone="gold">Destacada</Badge>}
                </div>
              </td>
              <td className="px-4 py-3">
                <PropertyRowActions property={property} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
