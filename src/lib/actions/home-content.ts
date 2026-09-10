"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { updateHomeContent } from "@/lib/data/home-content";
import {
  parseHomeContentFormData,
  type HomeContentFormValues,
} from "@/lib/validation/home-content-schema";
import type { ActionState } from "@/lib/types/action-state";
import type { HomeContentInput } from "@/lib/types/home-content";

function toHomeContentInput(values: HomeContentFormValues): HomeContentInput {
  return {
    hero: {
      badge: values.heroBadge,
      title: values.heroTitle,
      subtitle: values.heroSubtitle,
      primaryCtaLabel: values.heroPrimaryCta,
      secondaryCtaLabel: values.heroSecondaryCta,
    },
    zoneSection: {
      eyebrow: values.zoneEyebrow,
      title: values.zoneTitle,
      description: values.zoneDescription,
    },
    featuredSection: {
      eyebrow: values.featuredEyebrow,
      title: values.featuredTitle,
      description: values.featuredDescription,
    },
  };
}

export async function updateHomeContentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseHomeContentFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toHomeContentInput(parsed.data);
  await updateHomeContent(input);
  updateTag("home-content");
  refresh();
  return { status: "success", message: "Contenido actualizado." };
}
