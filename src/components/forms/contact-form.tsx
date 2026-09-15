"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { submitContactAction } from "@/lib/actions/contact";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import type { Property } from "@/lib/types/property";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const EMPTY_VALUES = { name: "", email: "", phone: "", message: "" };

export function ContactForm({ property, compact }: { property?: Property; compact?: boolean }) {
  const [state, formAction, pending] = useActionState(submitContactAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const [values, setValues] = useState(EMPTY_VALUES);

  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.status === "success") setValues(EMPTY_VALUES);
  }

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  return (
    <form action={formAction} className="space-y-4">
      {property && (
        <>
          <input type="hidden" name="propertyId" value={property.id} />
          <input type="hidden" name="propertySlug" value={property.slug} />
          <p className="text-xs text-muted-400">
            Consulta sobre: <span className="text-cream-50">{property.title}</span>
          </p>
        </>
      )}

      <Field name="name" label="Nombre" error={errors?.name} required>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={!!errors?.name}
          aria-describedby={errors?.name ? fieldErrorId("name") : undefined}
        />
      </Field>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field name="email" label="Correo" error={errors?.email} required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            aria-invalid={!!errors?.email}
            aria-describedby={errors?.email ? fieldErrorId("email") : undefined}
          />
        </Field>
        <Field name="phone" label="Teléfono" error={errors?.phone} hint="Opcional">
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          />
        </Field>
      </div>

      <Field name="message" label="Mensaje" error={errors?.message} required>
        <Textarea
          id="message"
          name="message"
          rows={compact ? 3 : 5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={!!errors?.message}
          aria-describedby={errors?.message ? fieldErrorId("message") : undefined}
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  );
}
