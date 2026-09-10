"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { NewsArticle } from "@/lib/types/news";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function NewsForm({
  mode,
  article,
  action,
}: {
  mode: "create" | "edit";
  article?: NewsArticle;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImage?.url ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(article?.coverImage?.alt ?? "");

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  const trimmedCoverUrl = coverImageUrl.trim();
  const showPreview = isAllowedImageUrl(trimmedCoverUrl);

  return (
    <form action={formAction} className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Información general</h2>
        <Field name="title" label="Título" error={errors?.title} required>
          <Input
            id="title"
            name="title"
            defaultValue={article?.title}
            aria-invalid={!!errors?.title}
            aria-describedby={errors?.title ? fieldErrorId("title") : undefined}
          />
        </Field>

        <Field
          name="excerpt"
          label="Resumen"
          error={errors?.excerpt}
          hint="Se muestra en la tarjeta de la noticia — máximo 240 caracteres"
          required
        >
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={article?.excerpt}
            aria-invalid={!!errors?.excerpt}
            aria-describedby={errors?.excerpt ? fieldErrorId("excerpt") : undefined}
          />
        </Field>

        <Field
          name="content"
          label="Contenido"
          error={errors?.content}
          hint="Deja una línea en blanco entre párrafos para separarlos"
          required
        >
          <Textarea
            id="content"
            name="content"
            rows={14}
            defaultValue={article?.content}
            aria-invalid={!!errors?.content}
            aria-describedby={errors?.content ? fieldErrorId("content") : undefined}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Imagen de portada</h2>
        <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <Field
              name="coverImageUrl"
              label="URL de la imagen"
              error={errors?.coverImageUrl}
              hint="Opcional"
            >
              <Input
                id="coverImageUrl"
                name="coverImageUrl"
                placeholder="https://images.unsplash.com/..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                aria-invalid={!!errors?.coverImageUrl}
                aria-describedby={errors?.coverImageUrl ? fieldErrorId("coverImageUrl") : undefined}
              />
            </Field>
            <Field
              name="coverImageAlt"
              label="Descripción de la imagen (alt)"
              error={errors?.coverImageAlt}
              hint={trimmedCoverUrl ? undefined : "Opcional"}
              required={!!trimmedCoverUrl}
            >
              <Input
                id="coverImageAlt"
                name="coverImageAlt"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                aria-invalid={!!errors?.coverImageAlt}
                aria-describedby={errors?.coverImageAlt ? fieldErrorId("coverImageAlt") : undefined}
              />
            </Field>
          </div>

          <div className="scrim-scope relative aspect-video overflow-hidden rounded-lg border border-cream-50/10 bg-ink-800">
            {showPreview ? (
              <Image
                src={trimmedCoverUrl}
                alt={coverImageAlt}
                fill
                sizes="(min-width: 640px) 400px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-400">
                <ImageOff className="size-6" aria-hidden />
                <p className="text-xs">Sin imagen de portada</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Publicación</h2>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="published" defaultChecked={article?.published ?? false} />
          Publicada (visible en el sitio)
        </label>
      </section>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-cream-50/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : mode === "create" ? "Crear noticia" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
