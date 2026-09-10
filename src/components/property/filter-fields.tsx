import { OPERATIONS, PROPERTY_TYPES, type PropertyQuery } from "@/lib/types/property";
import type { Zone } from "@/lib/types/zone";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const TYPE_LABEL: Record<(typeof PROPERTY_TYPES)[number], string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  oficina: "Oficina",
  parcela: "Parcela",
  local: "Local comercial",
};

export function FilterFields({
  zones,
  query,
  idPrefix = "",
}: {
  zones: Zone[];
  query: PropertyQuery;
  idPrefix?: string;
}) {
  const id = (name: string) => `${idPrefix}${name}`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
      <label className="flex flex-col gap-1.5 text-sm font-medium lg:col-span-1">
        Operación
        <Select id={id("operacion")} name="operacion" defaultValue={query.operation ?? ""}>
          <option value="">Todas</option>
          {OPERATIONS.map((op) => (
            <option key={op} value={op}>
              {op === "venta" ? "Venta" : "Arriendo"}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium lg:col-span-1">
        Zona
        <Select id={id("zona")} name="zona" defaultValue={query.zoneSlug ?? ""}>
          <option value="">Todas</option>
          {zones.map((zone) => (
            <option key={zone.slug} value={zone.slug}>
              {zone.name}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium lg:col-span-1">
        Tipo
        <Select id={id("tipo")} name="tipo" defaultValue={query.type ?? ""}>
          <option value="">Todos</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABEL[type]}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium lg:col-span-1">
        Dormitorios
        <Select id={id("dormitorios")} name="dormitorios" defaultValue={String(query.bedrooms ?? "")}>
          <option value="">Cualquiera</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium lg:col-span-1">
        Precio mín.
        <Input
          id={id("precioMin")}
          type="number"
          name="precioMin"
          min={0}
          placeholder={query.operation === "arriendo" ? "CLP" : "UF"}
          defaultValue={query.minPrice ?? ""}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium lg:col-span-1">
        Precio máx.
        <Input
          id={id("precioMax")}
          type="number"
          name="precioMax"
          min={0}
          placeholder={query.operation === "arriendo" ? "CLP" : "UF"}
          defaultValue={query.maxPrice ?? ""}
        />
      </label>
    </div>
  );
}
