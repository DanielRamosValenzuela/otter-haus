"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { render } from "@react-email/render";
import { getAccountByEmail, updateAdminPassword } from "@/lib/data/admin";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  deleteExpiredPasswordResetTokens,
} from "@/lib/data/password-reset";
import { hashPassword } from "@/lib/auth/credentials";
import { generateResetToken, hashResetToken, resetTokenExpiry } from "@/lib/auth/password-reset";
import {
  parseRequestPasswordResetFormData,
  parseResetPasswordFormData,
} from "@/lib/validation/password-reset-schema";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { SITE } from "@/lib/content/site";
import { LOGO_CID } from "@/emails/components/email-shell";
import { PasswordResetEmail } from "@/emails/password-reset";
import type { ActionState } from "@/lib/types/action-state";

const GENERIC_MESSAGE =
  "Si el correo tiene una cuenta, te enviamos un enlace para restablecer la contraseña.";

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000;

function isThrottled(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

async function logoAttachment() {
  const content = await readFile(path.join(process.cwd(), "public/image/logo-icon.png"));
  return { filename: "otterhaus-logo.png", content, contentId: LOGO_CID };
}

export async function requestPasswordResetAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseRequestPasswordResetFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email } = parsed.data;

  if (isThrottled(email)) {
    return { status: "success", message: GENERIC_MESSAGE };
  }
  recordAttempt(email);

  const account = await getAccountByEmail(email);
  if (account && account.active) {
    const token = generateResetToken();

    try {
      await deleteExpiredPasswordResetTokens();
      await createPasswordResetToken(account.id, hashResetToken(token), resetTokenExpiry());

      const [html, attachment] = await Promise.all([
        render(
          PasswordResetEmail({
            name: account.name,
            resetUrl: `${SITE.url}/dashboard/recuperar/${token}`,
          }),
        ),
        logoAttachment(),
      ]);

      await resend.emails.send({
        from: EMAIL_FROM,
        to: account.email,
        subject: "Recupera tu contraseña — OtterHaus",
        html,
        attachments: [attachment],
      });
    } catch (error) {
      console.error("No se pudo enviar el correo de recuperación:", error);
    }
  }

  return { status: "success", message: GENERIC_MESSAGE };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseResetPasswordFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const record = await consumePasswordResetToken(hashResetToken(parsed.data.token));
  if (!record) {
    return { status: "error", message: "El enlace no es válido o ya expiró." };
  }

  await updateAdminPassword(record.accountId, hashPassword(parsed.data.password));

  return { status: "success", message: "Contraseña actualizada. Ya puedes ingresar." };
}
