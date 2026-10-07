"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { LegalGuide } from "@/lib/types/legal-guide";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichTextField } from "@/components/ui/rich-text-field";
import { Button } from "@/components/ui/button";

interface DraftSection {
  key: string;
  id?: string;
  title: string;
  body: string;
}

export function LegalGuideForm({
  guide,
  action,
}: {
  guide: LegalGuide;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const [intro, setIntro] = useState(guide.intro);
  const [sections, setSections] = useState<DraftSection[]>(() =>
    guide.sections.map((section) => ({
      key: section.id,
      id: section.id,
      title: section.title,
      body: section.items.join("\n"),
    })),
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  function updateSection(index: number, patch: Partial<DraftSection>) {
    setSections((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function moveSection(index: number, offset: -1 | 1) {
    setSections((list) => {
      const target = index + offset;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addSection() {
    setSections((list) => [...list, { key: crypto.randomUUID(), title: "", body: "" }]);
  }

  function removeSection(index: number) {
    setSections((list) => list.filter((_, i) => i !== index));
  }

  const payload = JSON.stringify(
    sections.map(({ id, title, body }) => ({ id, title, body })),
  );

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="sections" value={payload} />

      <Field name="intro" label="Introducción" error={errors?.intro} required>
        <RichTextField
          id="intro"
          name="intro"
          rows={5}
          value={intro}
          onChange={setIntro}
          invalid={!!errors?.intro}
          describedBy={errors?.intro ? fieldErrorId("intro") : undefined}
        />
      </Field>

      <div className="space-y-5">
        <h2 className="font-display text-lg font-semibold text-gold-400">Secciones</h2>

        {errors?.sections && (
          <p className="text-sm text-danger-500" role="alert">
            {errors.sections.join(" ")}
          </p>
        )}

        {sections.map((section, index) => {
          const titleKey = `sections.${index}.title`;
          const bodyKey = `sections.${index}.body`;
          return (
            <div
              key={section.key}
              className="space-y-4 rounded-card border border-cream-50/10 bg-ink-900 p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-muted-400">Sección {index + 1}</p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Subir sección ${index + 1}`}
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                  >
                    <ArrowUp className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Bajar sección ${index + 1}`}
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    <ArrowDown className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Eliminar sección ${index + 1}`}
                    onClick={() => window.confirm("¿Eliminar esta sección?") && removeSection(index)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <Field name={titleKey} label="Título" error={errors?.[titleKey]} required>
                <Input
                  id={titleKey}
                  value={section.title}
                  onChange={(e) => updateSection(index, { title: e.target.value })}
                  aria-invalid={!!errors?.[titleKey]}
                  aria-describedby={errors?.[titleKey] ? fieldErrorId(titleKey) : undefined}
                />
              </Field>

              <Field
                name={bodyKey}
                label="Puntos"
                error={errors?.[bodyKey]}
                hint="Un punto por línea; usa los botones para negrita, cursiva o subrayado"
                required
              >
                <RichTextField
                  id={bodyKey}
                  name={bodyKey}
                  rows={6}
                  value={section.body}
                  onChange={(body) => updateSection(index, { body })}
                  invalid={!!errors?.[bodyKey]}
                  describedBy={errors?.[bodyKey] ? fieldErrorId(bodyKey) : undefined}
                />
              </Field>
            </div>
          );
        })}

        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="size-4" aria-hidden />
          Agregar sección
        </Button>
      </div>

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
