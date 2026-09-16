"use server";

import { refresh, updateTag } from "next/cache";
import { requireAuth } from "@/lib/auth/dal";
import { getAccountById, updateAccountProfile, updateAdminPassword } from "@/lib/data/admin";
import { hashPassword, verifyPasswordHash } from "@/lib/auth/credentials";
import { parseChangePasswordFormData, parseProfileFormData } from "@/lib/validation/account-schema";
import type { ActionState } from "@/lib/types/action-state";

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const account = await requireAuth();

  const parsed = parseProfileFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await updateAccountProfile(account.id, {
    name: parsed.data.name,
    roleTitle: parsed.data.roleTitle,
    photoUrl: parsed.data.photoUrl,
    bio: parsed.data.bio,
  });
  updateTag("team");
  refresh();

  return { status: "success", message: "Perfil actualizado." };
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAuth();

  const parsed = parseChangePasswordFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const account = await getAccountById(actor.id);
  if (!account || !verifyPasswordHash(parsed.data.currentPassword, account.passwordHash)) {
    return {
      status: "error",
      message: "La contraseña actual no es correcta.",
      fieldErrors: { currentPassword: ["Incorrecta."] },
    };
  }

  await updateAdminPassword(account.id, hashPassword(parsed.data.newPassword));

  return { status: "success", message: "Contraseña actualizada." };
}
