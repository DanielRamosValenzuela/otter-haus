"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImageOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { HomeContent, ValuePropIcon } from "@/lib/types/home-content";
import { VALUE_PROP_ICONS } from "@/lib/types/home-content";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import {
  VALUE_PROP_ICON_LABELS,
  VALUE_PROP_ICON_MAP,
} from "@/components/marketing/value-prop-icons";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UploadImageButton } from "@/components/dashboard/upload-image-button";

const MAX_VALUE_ITEMS = 8;
const LINK_HINT = "Usa /propiedades, /contacto o una dirección https://";

interface TextValues {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroPrimaryHref: string;
  heroSecondaryCta: string;
  heroSecondaryHref: string;
  heroMobileImageUrl: string;
  heroMobileImageAlt: string;
  zoneEyebrow: string;
  zoneTitle: string;
  zoneDescription: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredDescription: string;
  valueEyebrow: string;
  valueTitle: string;
  teamSingleEyebrow: string;
  teamSingleCtaLabel: string;
  teamEyebrow: string;
  teamTitle: string;
  teamCtaLabel: string;
  footerDescription: string;
}

interface VisibleValues {
  zoneVisible: boolean;
  featuredVisible: boolean;
  valueVisible: boolean;
  teamVisible: boolean;
}

interface DraftItem {
  key: string;
  id?: string;
  icon: ValuePropIcon;
  title: string;
  description: string;
}

export function HomeHeroForm({
  content,
  action,
}: {
  content: HomeContent;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [text, setText] = useState<TextValues>({
    heroBadge: content.hero.badge,
    heroTitle: content.hero.title,
    heroSubtitle: content.hero.subtitle,
    heroPrimaryCta: content.hero.primaryCtaLabel,
    heroPrimaryHref: content.hero.primaryCtaHref,
    heroSecondaryCta: content.hero.secondaryCtaLabel,
    heroSecondaryHref: content.hero.secondaryCtaHref,
    heroMobileImageUrl: content.hero.mobileImageUrl,
    heroMobileImageAlt: content.hero.mobileImageAlt,
    zoneEyebrow: content.zoneSection.eyebrow,
    zoneTitle: content.zoneSection.title,
    zoneDescription: content.zoneSection.description,
    featuredEyebrow: content.featuredSection.eyebrow,
    featuredTitle: content.featuredSection.title,
    featuredDescription: content.featuredSection.description,
    valueEyebrow: content.valueSection.eyebrow,
    valueTitle: content.valueSection.title,
    teamSingleEyebrow: content.teamSection.singleEyebrow,
    teamSingleCtaLabel: content.teamSection.singleCtaLabel,
    teamEyebrow: content.teamSection.teamEyebrow,
    teamTitle: content.teamSection.teamTitle,
    teamCtaLabel: content.teamSection.teamCtaLabel,
    footerDescription: content.footerDescription,
  });

  const [visible, setVisible] = useState<VisibleValues>({
    zoneVisible: content.zoneSection.visible,
    featuredVisible: content.featuredSection.visible,
    valueVisible: content.valueSection.visible,
    teamVisible: content.teamSection.visible,
  });

  const [items, setItems] = useState<DraftItem[]>(() =>
    content.valueSection.items.map((item) => ({ ...item, key: item.id })),
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  function setField<K extends keyof TextValues>(key: K, value: TextValues[K]) {
    setText((v) => ({ ...v, [key]: value }));
  }

  function updateItem(index: number, patch: Partial<DraftItem>) {
    setItems((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function moveItem(index: number, offset: -1 | 1) {
    setItems((list) => {
      const target = index + offset;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addItem() {
    setItems((list) => [
      ...list,
      { key: crypto.randomUUID(), icon: "sparkles", title: "", description: "" },
    ]);
  }

  function removeItem(index: number) {
    setItems((list) => list.filter((_, i) => i !== index));
  }

  const itemsPayload = JSON.stringify(
    items.map(({ id, icon, title, description }) => ({ id, icon, title, description })),
  );

  const trimmedImageUrl = text.heroMobileImageUrl.trim();
  const showPreview = isAllowedImageUrl(trimmedImageUrl);

  function input(name: keyof TextValues, label: string, opts?: FieldOpts) {
    const err = errors?.[name];
    const common = {
      id: name,
      name,
      value: text[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
        setField(name, e.target.value),
      "aria-invalid": !!err,
      "aria-describedby": err ? fieldErrorId(name) : undefined,
    };
    return (
      <Field name={name} label={label} error={err} hint={opts?.hint} required>
        {opts?.rows ? <Textarea rows={opts.rows} {...common} /> : <Input {...common} />}
      </Field>
    );
  }

  function visibleToggle(name: keyof VisibleValues) {
    return (
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          name={name}
          checked={visible[name]}
          onChange={(e) => setVisible((v) => ({ ...v, [name]: e.target.checked }))}
        />
        Mostrar esta sección en la portada
      </label>
    );
  }

  return (
    <form action={formAction} className="space-y-10">
      <input type="hidden" name="valueItems" value={itemsPayload} />

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Hero</h2>
        {input("heroBadge", "Etiqueta sobre el título", { hint: "Texto pequeño que aparece sobre el título principal" })}
        {input("heroTitle", "Título")}
        {input("heroSubtitle", "Subtítulo", { rows: 3 })}

        <div className="grid gap-4 sm:grid-cols-2">
          {input("heroPrimaryCta", "Botón principal")}
          {input("heroPrimaryHref", "Enlace del botón principal", { hint: LINK_HINT })}
          {input("heroSecondaryCta", "Botón secundario")}
          {input("heroSecondaryHref", "Enlace del botón secundario", { hint: LINK_HINT })}
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <div className="space-y-4">
            {input("heroMobileImageUrl", "Imagen de fondo en celulares (URL)")}
            {input("heroMobileImageAlt", "Descripción de la imagen (para accesibilidad y buscadores)")}
            <UploadImageButton
              sizeHint="Tamaño recomendado: 1200 x 1800 px (vertical). Es el fondo de la portada en celulares; en computador se ve el video."
              onUploaded={(uploadedUrl) => {
                setField("heroMobileImageUrl", uploadedUrl);
                setUploadError(null);
              }}
              onError={setUploadError}
            />
            {uploadError && (
              <p className="text-xs text-danger-500" role="alert">
                {uploadError}
              </p>
            )}
          </div>
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-cream-50/10 bg-ink-800">
            {showPreview ? (
              <Image
                src={trimmedImageUrl}
                alt={text.heroMobileImageAlt}
                fill
                sizes="200px"
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

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">
          Sección: Explora por zona
        </h2>
        {visibleToggle("zoneVisible")}
        {input("zoneEyebrow", "Texto pequeño sobre el título")}
        {input("zoneTitle", "Título")}
        {input("zoneDescription", "Descripción", { rows: 3 })}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">
          Sección: Propiedades destacadas
        </h2>
        {visibleToggle("featuredVisible")}
        {input("featuredEyebrow", "Texto pequeño sobre el título")}
        {input("featuredTitle", "Título")}
        {input("featuredDescription", "Descripción", { rows: 3 })}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">
          Sección: Por qué elegirnos
        </h2>
        {visibleToggle("valueVisible")}
        {input("valueEyebrow", "Texto pequeño sobre el título")}
        {input("valueTitle", "Título")}

        {errors?.valueItems && (
          <p className="text-sm text-danger-500" role="alert">
            {errors.valueItems.join(" ")}
          </p>
        )}

        {items.map((item, index) => {
          const titleKey = `valueItems.${index}.title`;
          const descKey = `valueItems.${index}.description`;
          const Icon = VALUE_PROP_ICON_MAP[item.icon];
          return (
            <div
              key={item.key}
              className="space-y-4 rounded-card border border-cream-50/10 bg-ink-900 p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-muted-400">Elemento {index + 1}</p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Subir elemento ${index + 1}`}
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                  >
                    <ArrowUp className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Bajar elemento ${index + 1}`}
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                  >
                    <ArrowDown className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Eliminar elemento ${index + 1}`}
                    onClick={() => window.confirm("¿Eliminar este elemento?") && removeItem(index)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <Field name={`valueItemIcon${index}`} label="Ícono">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-cream-50/10 bg-ink-800 text-gold-400">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <Select
                    id={`valueItemIcon${index}`}
                    value={item.icon}
                    onChange={(e) => updateItem(index, { icon: e.target.value as ValuePropIcon })}
                  >
                    {VALUE_PROP_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {VALUE_PROP_ICON_LABELS[icon]}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>

              <Field name={titleKey} label="Título" error={errors?.[titleKey]} required>
                <Input
                  id={titleKey}
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  aria-invalid={!!errors?.[titleKey]}
                  aria-describedby={errors?.[titleKey] ? fieldErrorId(titleKey) : undefined}
                />
              </Field>

              <Field name={descKey} label="Descripción" error={errors?.[descKey]} required>
                <Textarea
                  id={descKey}
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  aria-invalid={!!errors?.[descKey]}
                  aria-describedby={errors?.[descKey] ? fieldErrorId(descKey) : undefined}
                />
              </Field>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={items.length >= MAX_VALUE_ITEMS}
          onClick={addItem}
        >
          <Plus className="size-4" aria-hidden />
          Agregar elemento
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">
          Sección: Equipo / Tu corredora
        </h2>
        {visibleToggle("teamVisible")}
        <p className="text-xs text-muted-400">
          La versión &quot;Tu corredora&quot; se muestra cuando nadie está destacado en Nosotros; la
          versión de equipo se muestra cuando hay personas destacadas.
        </p>
        <p className="rounded-lg border border-gold-500/30 bg-gold-500/5 p-3 text-xs text-cream-50/90">
          El párrafo de presentación de la corredora (por ejemplo &quot;Fundador de un nuevo
          proyecto…&quot;) se edita más abajo en esta misma página:{" "}
          <a href="#perfil-corredora" className="font-medium text-gold-400 hover:text-gold-300">
            Perfil de la corredora → Biografía corta
          </a>
          .
        </p>
        {input("teamSingleEyebrow", "Texto pequeño sobre el título (una sola persona)")}
        {input("teamSingleCtaLabel", "Botón (Tu corredora)", {
          hint: "Usa {nombre} para insertar el primer nombre de la persona",
        })}
        {input("teamEyebrow", "Texto pequeño sobre el título (equipo)")}
        {input("teamTitle", "Título (equipo)")}
        {input("teamCtaLabel", "Botón (equipo)")}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Pie de página</h2>
        {input("footerDescription", "Descripción", {
          rows: 2,
          hint: "Texto que aparece bajo el logo en el pie de página",
        })}
      </section>

      {state.status === "error" && (
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

interface FieldOpts {
  hint?: string;
  rows?: number;
}
