"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      <Field name="email" label="Correo" error={errors?.email} required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? fieldErrorId("email") : undefined}
        />
      </Field>

      <Field name="password" label="Contraseña" error={errors?.password} required>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-11"
            aria-invalid={!!errors?.password}
            aria-describedby={errors?.password ? fieldErrorId("password") : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-400 transition-colors hover:text-cream-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </Field>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
