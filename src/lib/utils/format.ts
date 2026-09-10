import type { PropertyPrice } from "@/lib/types/property";

const ufFormatter = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });
const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});
const areaFormatter = new Intl.NumberFormat("es-CL");
const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const DIACRITICS_RE = new RegExp("[\\u0300-\\u036f]", "g");

export function formatPrice({ amount, currency }: PropertyPrice): string {
  if (currency === "UF") return `UF ${ufFormatter.format(amount)}`;
  return clpFormatter.format(amount);
}

export function formatArea(m2: number): string {
  return `${areaFormatter.format(m2)} m²`;
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
