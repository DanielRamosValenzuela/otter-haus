"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, ADMIN_ID } from "@/lib/auth/credentials";
import { createSession, destroySession } from "@/lib/auth/session";
import { parseLoginFormData } from "@/lib/validation/login-schema";
import type { ActionState } from "@/lib/types/action-state";

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseLoginFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, next } = parsed.data;
  const admin = await verifyCredentials(email, password);

  if (!admin) {
    return { status: "error", message: "Correo o contraseña incorrectos." };
  }

  await createSession({ userId: ADMIN_ID, email: admin.email });
  redirect(next && next.startsWith("/dashboard") ? next : "/dashboard/propiedades");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/dashboard/login");
}
