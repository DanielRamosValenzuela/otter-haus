"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { saveLegalGuide } from "@/lib/data/legal-guide";
import { parseLegalGuideFormData } from "@/lib/validation/legal-guide-schema";
import type { ActionState } from "@/lib/types/action-state";

export async function updateLegalGuideAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseLegalGuideFormData(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors };
  }

  await saveLegalGuide(parsed.data);
  updateTag("legal-guide");
  refresh();
  return { status: "success", message: "Guía legal actualizada." };
}
