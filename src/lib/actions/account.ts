"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { getAdmin, updateAdminPassword } from "@/lib/data/admin";
import { hashPassword, verifyPasswordHash } from "@/lib/auth/credentials";
import { parseChangePasswordFormData } from "@/lib/validation/account-schema";
import type { ActionState } from "@/lib/types/action-state";

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseChangePasswordFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const admin = await getAdmin();
  if (!verifyPasswordHash(parsed.data.currentPassword, admin.passwordHash)) {
    return {
      status: "error",
      message: "La contraseña actual no es correcta.",
      fieldErrors: { currentPassword: ["Incorrecta."] },
    };
  }

  await updateAdminPassword(hashPassword(parsed.data.newPassword));

  return { status: "success", message: "Contraseña actualizada." };
}
