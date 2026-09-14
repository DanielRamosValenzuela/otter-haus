"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { changePasswordAction } from "@/lib/actions/account";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function PasswordInput({
  id,
  name,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  autoComplete: string;
  error?: string[];
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
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

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <Field name="currentPassword" label="Contraseña actual" error={errors?.currentPassword} required>
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          error={errors?.currentPassword}
        />
      </Field>

      <Field
        name="newPassword"
        label="Nueva contraseña"
        error={errors?.newPassword}
        hint="Mínimo 8 caracteres."
        required
      >
        <PasswordInput id="newPassword" name="newPassword" autoComplete="new-password" error={errors?.newPassword} />
      </Field>

      <Field name="confirmPassword" label="Confirmar nueva contraseña" error={errors?.confirmPassword} required>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          error={errors?.confirmPassword}
        />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Actualizar contraseña"}
      </Button>
    </form>
  );
}
