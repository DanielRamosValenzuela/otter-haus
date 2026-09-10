"use server";

import { createLead } from "@/lib/data/leads";
import { parseContactFormData } from "@/lib/validation/contact-schema";
import { IDLE_ACTION_STATE, type ActionState } from "@/lib/types/action-state";

export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseContactFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await createLead(parsed.data);

  return {
    status: "success",
    message: "¡Gracias! Te contactaremos a la brevedad.",
  };
}

export { IDLE_ACTION_STATE };
