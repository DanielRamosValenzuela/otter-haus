"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/password-reset";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function PasswordInput({
  id,
  name,
  error,
}: {
  id: string;
  name: string;
  error?: string[];
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        autoComplete="new-password"
        className="pr-11"
        aria-invalid={!!error}
        aria-describedby={error ? fieldErrorId(name) : undefined}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        tabIndex={-1}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-400 transition-colors hover:text-cream-50"
      >
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-cream-50/90" role="status">
          {state.message}
        </p>
        <Button as={Link} href="/dashboard/login" className="w-full">
          Ir a ingresar
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <Field
        name="password"
        label="Nueva contraseña"
        error={errors?.password}
        hint="Mínimo 8 caracteres."
        required
      >
        <PasswordInput id="password" name="password" error={errors?.password} />
      </Field>

      <Field name="confirmPassword" label="Confirmar nueva contraseña" error={errors?.confirmPassword} required>
        <PasswordInput id="confirmPassword" name="confirmPassword" error={errors?.confirmPassword} />
      </Field>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando…" : "Restablecer contraseña"}
      </Button>
    </form>
  );
}
