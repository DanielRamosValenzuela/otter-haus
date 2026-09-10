"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { createZone, deleteZone, updateZone } from "@/lib/data/zones";
import { parseZoneFormData, type ZoneFormValues } from "@/lib/validation/zone-schema";
import type { ActionState } from "@/lib/types/action-state";
import type { ZoneInput } from "@/lib/types/zone";

function toZoneInput(values: ZoneFormValues): ZoneInput {
  return {
    name: values.name,
    slug: values.slug ?? "",
    imageUrl: values.imageUrl,
    description: values.description,
  };
}

function invalidateZoneCaches() {
  updateTag("zones");
  updateTag("properties");
  refresh();
}

export async function createZoneAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseZoneFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toZoneInput(parsed.data);
  await createZone(input);
  invalidateZoneCaches();
  redirect("/dashboard/zonas?toast=creada");
}

export async function updateZoneAction(
  slug: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseZoneFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toZoneInput(parsed.data);
  await updateZone(slug, input);
  invalidateZoneCaches();
  return { status: "success", message: "Zona actualizada." };
}

export async function deleteZoneAction(slug: string): Promise<void> {
  await requireAdmin();
  await deleteZone(slug);
  invalidateZoneCaches();
}
