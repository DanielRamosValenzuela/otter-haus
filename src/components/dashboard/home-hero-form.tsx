"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { HomeContent } from "@/lib/types/home-content";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function HomeHeroForm({
  content,
  action,
}: {
  content: HomeContent;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  return (
    <form action={formAction} className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Hero</h2>
        <Field
          name="heroBadge"
          label="Badge"
          error={errors?.heroBadge}
          hint="Texto pequeño sobre el título"
          required
        >
          <Input
            id="heroBadge"
            name="heroBadge"
            defaultValue={content.hero.badge}
            aria-invalid={!!errors?.heroBadge}
            aria-describedby={errors?.heroBadge ? fieldErrorId("heroBadge") : undefined}
          />
        </Field>

        <Field name="heroTitle" label="Título" error={errors?.heroTitle} required>
          <Input
            id="heroTitle"
            name="heroTitle"
            defaultValue={content.hero.title}
            aria-invalid={!!errors?.heroTitle}
            aria-describedby={errors?.heroTitle ? fieldErrorId("heroTitle") : undefined}
          />
        </Field>

        <Field name="heroSubtitle" label="Subtítulo" error={errors?.heroSubtitle} required>
          <Textarea
            id="heroSubtitle"
            name="heroSubtitle"
            rows={3}
            defaultValue={content.hero.subtitle}
            aria-invalid={!!errors?.heroSubtitle}
            aria-describedby={errors?.heroSubtitle ? fieldErrorId("heroSubtitle") : undefined}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="heroPrimaryCta"
            label="Botón principal"
            error={errors?.heroPrimaryCta}
            hint="Texto del botón principal — el link sigue apuntando a /propiedades"
            required
          >
            <Input
              id="heroPrimaryCta"
              name="heroPrimaryCta"
              defaultValue={content.hero.primaryCtaLabel}
              aria-invalid={!!errors?.heroPrimaryCta}
              aria-describedby={errors?.heroPrimaryCta ? fieldErrorId("heroPrimaryCta") : undefined}
            />
          </Field>
          <Field
            name="heroSecondaryCta"
            label="Botón secundario"
            error={errors?.heroSecondaryCta}
            hint="El link sigue apuntando a /nosotros"
            required
          >
            <Input
              id="heroSecondaryCta"
              name="heroSecondaryCta"
              defaultValue={content.hero.secondaryCtaLabel}
              aria-invalid={!!errors?.heroSecondaryCta}
              aria-describedby={
                errors?.heroSecondaryCta ? fieldErrorId("heroSecondaryCta") : undefined
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">
          Sección: Explora por zona
        </h2>
        <Field name="zoneEyebrow" label="Eyebrow" error={errors?.zoneEyebrow} required>
          <Input
            id="zoneEyebrow"
            name="zoneEyebrow"
            defaultValue={content.zoneSection.eyebrow}
            aria-invalid={!!errors?.zoneEyebrow}
            aria-describedby={errors?.zoneEyebrow ? fieldErrorId("zoneEyebrow") : undefined}
          />
        </Field>
        <Field name="zoneTitle" label="Título" error={errors?.zoneTitle} required>
          <Input
            id="zoneTitle"
            name="zoneTitle"
            defaultValue={content.zoneSection.title}
            aria-invalid={!!errors?.zoneTitle}
            aria-describedby={errors?.zoneTitle ? fieldErrorId("zoneTitle") : undefined}
          />
        </Field>
        <Field
          name="zoneDescription"
          label="Descripción"
          error={errors?.zoneDescription}
          required
        >
          <Textarea
            id="zoneDescription"
            name="zoneDescription"
            rows={3}
            defaultValue={content.zoneSection.description}
            aria-invalid={!!errors?.zoneDescription}
            aria-describedby={
              errors?.zoneDescription ? fieldErrorId("zoneDescription") : undefined
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">
          Sección: Propiedades destacadas
        </h2>
        <Field name="featuredEyebrow" label="Eyebrow" error={errors?.featuredEyebrow} required>
          <Input
            id="featuredEyebrow"
            name="featuredEyebrow"
            defaultValue={content.featuredSection.eyebrow}
            aria-invalid={!!errors?.featuredEyebrow}
            aria-describedby={
              errors?.featuredEyebrow ? fieldErrorId("featuredEyebrow") : undefined
            }
          />
        </Field>
        <Field name="featuredTitle" label="Título" error={errors?.featuredTitle} required>
          <Input
            id="featuredTitle"
            name="featuredTitle"
            defaultValue={content.featuredSection.title}
            aria-invalid={!!errors?.featuredTitle}
            aria-describedby={errors?.featuredTitle ? fieldErrorId("featuredTitle") : undefined}
          />
        </Field>
        <Field
          name="featuredDescription"
          label="Descripción"
          error={errors?.featuredDescription}
          required
        >
          <Textarea
            id="featuredDescription"
            name="featuredDescription"
            rows={3}
            defaultValue={content.featuredSection.description}
            aria-invalid={!!errors?.featuredDescription}
            aria-describedby={
              errors?.featuredDescription ? fieldErrorId("featuredDescription") : undefined
            }
          />
        </Field>
      </section>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-cream-50/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
