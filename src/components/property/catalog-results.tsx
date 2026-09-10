import { listProperties } from "@/lib/data/properties";
import { listZones } from "@/lib/data/zones";
import { parsePropertySearchParams, buildPropertyQueryString, type RawSearchParams } from "@/lib/validation/search-params";
import { FilterBar } from "@/components/property/filter-bar";
import { FilterDrawer } from "@/components/property/filter-drawer";
import { ActiveFilters } from "@/components/property/active-filters";
import { SortSelect } from "@/components/property/sort-select";
import { PropertyGrid } from "@/components/property/property-grid";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pluralize } from "@/lib/utils/format";

export async function CatalogResults({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const raw = await searchParams;
  const query = parsePropertySearchParams(raw);

  const [zones, result] = await Promise.all([listZones(), listProperties(query)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:hidden">
        <FilterDrawer zones={zones} query={query} />
      </div>

      <FilterBar zones={zones} query={query} />

      <ActiveFilters query={query} zones={zones} />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-400">
          {result.total} {pluralize(result.total, "propiedad encontrada", "propiedades encontradas")}
        </p>
        <SortSelect query={query} />
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="No encontramos propiedades con esos filtros"
          description="Prueba ajustando los filtros, o contáctanos directamente y te ayudamos a encontrar lo que buscas."
          action={
            <div className="flex gap-3">
              <Button as={Link} href="/propiedades" variant="outline" size="sm">
                Limpiar filtros
              </Button>
              <Button as={Link} href="/contacto" size="sm">
                Contactar
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <PropertyGrid properties={result.items} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            buildHref={(page) => `/propiedades${buildPropertyQueryString({ ...query, page })}`}
          />
        </>
      )}
    </div>
  );
}
