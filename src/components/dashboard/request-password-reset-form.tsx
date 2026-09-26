"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/lib/actions/password-reset";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RequestPasswordResetForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <p className="text-sm text-cream-50/90" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Field name="email" label="Correo" error={errors?.email} required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? fieldErrorId("email") : undefined}
        />
      </Field>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : "Enviar enlace de recuperación"}
      </Button>
    </form>
  );
}
