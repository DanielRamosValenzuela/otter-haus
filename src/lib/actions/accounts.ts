"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { createSubAdmin, getAccountByEmail, setAccountActive } from "@/lib/data/admin";
import { hashPassword } from "@/lib/auth/credentials";
import { parseCreateSubAdminFormData } from "@/lib/validation/sub-admin-schema";
import type { ActionState } from "@/lib/types/action-state";

export async function createSubAdminAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseCreateSubAdminFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await getAccountByEmail(parsed.data.email);
  if (existing) {
    return {
      status: "error",
      message: "Ese correo ya tiene una cuenta.",
      fieldErrors: { email: ["Ya está en uso."] },
    };
  }

  await createSubAdmin(
    { name: parsed.data.name, email: parsed.data.email, password: parsed.data.password, roleTitle: parsed.data.roleTitle },
    hashPassword(parsed.data.password),
  );
  updateTag("team");
  refresh();

  redirect("/dashboard/cuentas?toast=creada");
}

export async function setAccountActiveAction(id: string, active: boolean): Promise<void> {
  await requireAdmin();
  await setAccountActive(id, active);
  updateTag("team");
  refresh();
}
