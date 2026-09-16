"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";
import {
  createProperty,
  deleteProperty,
  getPropertyByIdForAdmin,
  setPropertyFeatured,
  setPropertyPublished,
  updateProperty,
} from "@/lib/data/properties";
import { listZones } from "@/lib/data/zones";
import {
  parsePropertyFormData,
  CUSTOM_ZONE_VALUE,
  type PropertyFormValues,
} from "@/lib/validation/property-schema";
import { slugify } from "@/lib/utils/format";
import { extractMapsCoordinates } from "@/lib/utils/google-maps";
import type { ActionState } from "@/lib/types/action-state";
import type { AdminUser } from "@/lib/types/session";
import type { Property, PropertyInput } from "@/lib/types/property";

async function resolveZone(zoneSlug: string, customZoneName?: string) {
  if (zoneSlug === CUSTOM_ZONE_VALUE) {
    const name = customZoneName!.trim();
    return { zone: name, zoneSlug: slugify(name) };
  }
  const zones = await listZones();
  const zone = zones.find((z) => z.slug === zoneSlug);
  return { zone: zone?.name ?? zoneSlug, zoneSlug };
}

async function toPropertyInput(values: PropertyFormValues): Promise<Omit<PropertyInput, "createdBy">> {
  const { zone, zoneSlug } = await resolveZone(values.zoneSlug, values.customZoneName);
  const currency = values.operation === "venta" ? "UF" : "CLP";
  const coordinates = values.mapsUrl ? await extractMapsCoordinates(values.mapsUrl) : null;

  return {
    title: values.title,
    slug: values.slug,
    operation: values.operation,
    type: values.type,
    status: values.status,
    location: {
      zone,
      zoneSlug,
      commune: values.commune,
      city: values.city,
      addressHint: values.addressHint,
      mapsUrl: values.mapsUrl,
      mapsLat: coordinates?.lat,
      mapsLng: coordinates?.lng,
    },
    price: { amount: values.priceAmount, currency },
    features: {
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      parkingSpaces: values.parkingSpaces,
      builtAreaM2: values.builtAreaM2,
      landAreaM2: values.landAreaM2,
      amenities: values.amenities,
    },
    description: values.description,
    images: values.images,
    featured: values.featured,
    published: values.published,
  };
}

async function requireOwnedProperty(id: string, actor: AdminUser): Promise<Property> {
  const property = await getPropertyByIdForAdmin(id);
  if (!property) throw new Error("Propiedad no encontrada");
  if (actor.role !== "admin" && property.createdBy !== actor.id) {
    throw new Error("No autorizado");
  }
  return property;
}

function invalidatePropertyCaches(property?: Property) {
  updateTag("properties");
  updateTag("zones");
  if (property) updateTag(`property:${property.slug}`);
  refresh();
}

export async function createPropertyAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAuth();

  const parsed = parsePropertyFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = await toPropertyInput(parsed.data);
  const property = await createProperty({ ...input, createdBy: actor.id });
  invalidatePropertyCaches(property);
  redirect("/dashboard/propiedades?toast=creada");
}

export async function updatePropertyAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAuth();
  await requireOwnedProperty(id, actor);

  const parsed = parsePropertyFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = await toPropertyInput(parsed.data);
  const property = await updateProperty(id, input);
  invalidatePropertyCaches(property);
  return { status: "success", message: "Propiedad actualizada." };
}

export async function deletePropertyAction(id: string): Promise<void> {
  const actor = await requireAuth();
  await requireOwnedProperty(id, actor);
  await deleteProperty(id);
  invalidatePropertyCaches();
}

export async function togglePublishedAction(id: string, published: boolean): Promise<void> {
  const actor = await requireAuth();
  await requireOwnedProperty(id, actor);
  const property = await setPropertyPublished(id, published);
  invalidatePropertyCaches(property);
}

export async function toggleFeaturedAction(id: string, featured: boolean): Promise<void> {
  const actor = await requireAuth();
  await requireOwnedProperty(id, actor);
  const property = await setPropertyFeatured(id, featured);
  invalidatePropertyCaches(property);
}
