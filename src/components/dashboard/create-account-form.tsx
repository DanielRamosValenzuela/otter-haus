"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSubAdminAction } from "@/lib/actions/accounts";

const EMPTY_VALUES = { name: "", email: "", password: "", roleTitle: "" };

export function CreateAccountForm() {
  const [state, formAction, pending] = useActionState(createSubAdminAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const [values, setValues] = useState(EMPTY_VALUES);

  function setField<K extends keyof typeof EMPTY_VALUES>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  useEffect(() => {
    if (state.status === "error" && !errors) toast.error(state.message);
  }, [state, errors]);

  return (
    <form action={formAction} className="space-y-6">
      <Field name="name" label="Nombre" error={errors?.name} required>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors?.name}
          aria-describedby={errors?.name ? fieldErrorId("name") : undefined}
        />
      </Field>

      <Field name="email" label="Correo" error={errors?.email} required>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? fieldErrorId("email") : undefined}
        />
      </Field>

      <Field
        name="roleTitle"
        label="Cargo"
        error={errors?.roleTitle}
        hint="Opcional — se muestra en su perfil público"
      >
        <Input
          id="roleTitle"
          name="roleTitle"
          placeholder="Editor de contenido"
          value={values.roleTitle}
          onChange={(e) => setField("roleTitle", e.target.value)}
        />
      </Field>

      <Field
        name="password"
        label="Contraseña inicial"
        error={errors?.password}
        hint="Mínimo 8 caracteres — la persona la puede cambiar después desde su cuenta"
        required
      >
        <Input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={(e) => setField("password", e.target.value)}
          aria-invalid={!!errors?.password}
          aria-describedby={errors?.password ? fieldErrorId("password") : undefined}
        />
      </Field>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-cream-50/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear cuenta"}
        </Button>
      </div>
    </form>
  );
}
