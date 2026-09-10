"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { ZoneInput } from "@/lib/types/zone";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ZoneForm({
  mode,
  zone,
  action,
}: {
  mode: "create" | "edit";
  zone?: ZoneInput;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const [imageUrl, setImageUrl] = useState(zone?.imageUrl ?? "");

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  const trimmedImageUrl = imageUrl.trim();
  const showPreview = isAllowedImageUrl(trimmedImageUrl);

  return (
    <form action={formAction} className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Información general</h2>
        <Field name="name" label="Nombre" error={errors?.name} required>
          <Input
            id="name"
            name="name"
            defaultValue={zone?.name}
            aria-invalid={!!errors?.name}
            aria-describedby={errors?.name ? fieldErrorId("name") : undefined}
          />
        </Field>

        <Field
          name="slug"
          label="Slug"
          error={errors?.slug}
          hint="Se genera automáticamente si lo dejas vacío"
        >
          <Input
            id="slug"
            name="slug"
            defaultValue={zone?.slug}
            aria-invalid={!!errors?.slug}
            aria-describedby={errors?.slug ? fieldErrorId("slug") : undefined}
          />
        </Field>

        <Field
          name="description"
          label="Descripción"
          error={errors?.description}
          hint="Opcional"
        >
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={zone?.description}
            aria-invalid={!!errors?.description}
            aria-describedby={errors?.description ? fieldErrorId("description") : undefined}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Imagen</h2>
        <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <Field
              name="imageUrl"
              label="URL de la imagen"
              error={errors?.imageUrl}
              hint="Opcional"
            >
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                aria-invalid={!!errors?.imageUrl}
                aria-describedby={errors?.imageUrl ? fieldErrorId("imageUrl") : undefined}
              />
            </Field>
          </div>

          <div className="scrim-scope relative aspect-video overflow-hidden rounded-lg border border-cream-50/10 bg-ink-800">
            {showPreview ? (
              <Image
                src={trimmedImageUrl}
                alt={zone?.name ?? ""}
                fill
                sizes="(min-width: 640px) 400px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-400">
                <ImageOff className="size-6" aria-hidden />
                <p className="text-xs">Sin imagen</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-cream-50/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : mode === "create" ? "Crear zona" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
