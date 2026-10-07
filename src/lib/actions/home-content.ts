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
      primaryCtaHref: values.heroPrimaryHref,
      secondaryCtaLabel: values.heroSecondaryCta,
      secondaryCtaHref: values.heroSecondaryHref,
      mobileImageUrl: values.heroMobileImageUrl,
      mobileImageAlt: values.heroMobileImageAlt,
    },
    zoneSection: {
      visible: values.zoneVisible,
      eyebrow: values.zoneEyebrow,
      title: values.zoneTitle,
      description: values.zoneDescription,
    },
    featuredSection: {
      visible: values.featuredVisible,
      eyebrow: values.featuredEyebrow,
      title: values.featuredTitle,
      description: values.featuredDescription,
    },
    valueSection: {
      visible: values.valueVisible,
      eyebrow: values.valueEyebrow,
      title: values.valueTitle,
      items: values.valueItems,
    },
    teamSection: {
      visible: values.teamVisible,
      singleEyebrow: values.teamSingleEyebrow,
      singleCtaLabel: values.teamSingleCtaLabel,
      teamEyebrow: values.teamEyebrow,
      teamTitle: values.teamTitle,
      teamCtaLabel: values.teamCtaLabel,
    },
    footerDescription: values.footerDescription,
  };
}

export async function updateHomeContentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseHomeContentFormData(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors };
  }

  await updateHomeContent(toHomeContentInput(parsed.data));
  updateTag("home-content");
  refresh();
  return { status: "success", message: "Contenido actualizado." };
}
