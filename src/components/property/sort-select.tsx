"use client";

import { useRef } from "react";
import type { PropertyQuery } from "@/lib/types/property";
import { Select } from "@/components/ui/select";

const SORT_LABEL: Record<NonNullable<PropertyQuery["sort"]>, string> = {
  destacadas: "Destacadas primero",
  recientes: "Más recientes",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
};

export function SortSelect({ query }: { query: PropertyQuery }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action="/propiedades" method="get" className="flex items-center gap-2">
      {query.operation && <input type="hidden" name="operacion" value={query.operation} />}
      {query.zoneSlug && <input type="hidden" name="zona" value={query.zoneSlug} />}
      {query.type && <input type="hidden" name="tipo" value={query.type} />}
      {query.minPrice != null && <input type="hidden" name="precioMin" value={query.minPrice} />}
      {query.maxPrice != null && <input type="hidden" name="precioMax" value={query.maxPrice} />}
      {query.bedrooms != null && <input type="hidden" name="dormitorios" value={query.bedrooms} />}

      <label htmlFor="orden" className="text-sm text-muted-400 whitespace-nowrap">
        Ordenar por
      </label>
      <Select
        id="orden"
        name="orden"
        defaultValue={query.sort ?? "destacadas"}
        onChange={() => formRef.current?.requestSubmit()}
        className="w-auto min-w-[11rem]"
      >
        {Object.entries(SORT_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <noscript>
        <button type="submit" className="text-sm text-gold-400 underline">
          Aplicar
        </button>
      </noscript>
    </form>
  );
}
