"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  OPERATIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type Property,
} from "@/lib/types/property";
import type { Zone } from "@/lib/types/zone";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { CUSTOM_ZONE_VALUE } from "@/lib/validation/property-schema";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUrlEditor } from "@/components/dashboard/image-url-editor";

const OPERATION_LABEL: Record<(typeof OPERATIONS)[number], string> = {
  venta: "Venta",
  arriendo: "Arriendo",
};
const TYPE_LABEL: Record<(typeof PROPERTY_TYPES)[number], string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  oficina: "Oficina",
  parcela: "Parcela",
  local: "Local comercial",
};
const STATUS_LABEL: Record<(typeof PROPERTY_STATUSES)[number], string> = {
  disponible: "Disponible",
  reservada: "Reservada",
  cerrada: "Cerrada",
};

interface TextValues {
  title: string;
  description: string;
  customZoneName: string;
  commune: string;
  city: string;
  addressHint: string;
  mapsUrl: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  builtAreaM2: string;
  landAreaM2: string;
  amenities: string;
  priceAmount: string;
}

export function PropertyForm({
  mode,
  zones,
  property,
  action,
}: {
  mode: "create" | "edit";
  zones: Zone[];
  property?: Property;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const isKnownZone = property ? zones.some((z) => z.slug === property.location.zoneSlug) : true;
  const [zoneSlug, setZoneSlug] = useState(
    property ? (isKnownZone ? property.location.zoneSlug : CUSTOM_ZONE_VALUE) : (zones[0]?.slug ?? ""),
  );
  const [operation, setOperation] = useState<(typeof OPERATIONS)[number]>(
    property?.operation ?? "venta",
  );
  const [type, setType] = useState<(typeof PROPERTY_TYPES)[number]>(property?.type ?? "casa");
  const [status, setStatus] = useState<(typeof PROPERTY_STATUSES)[number]>(
    property?.status ?? "disponible",
  );
  const [featured, setFeatured] = useState(property?.featured ?? false);
  const [published, setPublished] = useState(property?.published ?? false);

  const [text, setText] = useState<TextValues>({
    title: property?.title ?? "",
    description: property?.description ?? "",
    customZoneName: !isKnownZone ? (property?.location.zone ?? "") : "",
    commune: property?.location.commune ?? "",
    city: property?.location.city ?? "",
    addressHint: property?.location.addressHint ?? "",
    mapsUrl: property?.location.mapsUrl ?? "",
    bedrooms: String(property?.features.bedrooms ?? 0),
    bathrooms: String(property?.features.bathrooms ?? 0),
    parkingSpaces: String(property?.features.parkingSpaces ?? 0),
    builtAreaM2: String(property?.features.builtAreaM2 ?? 0),
    landAreaM2: property?.features.landAreaM2 != null ? String(property.features.landAreaM2) : "",
    amenities: property?.features.amenities.join(", ") ?? "",
    priceAmount: property?.price.amount != null ? String(property.price.amount) : "",
  });

  function setField<K extends keyof TextValues>(key: K, value: TextValues[K]) {
    setText((v) => ({ ...v, [key]: value }));
  }

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !errors) {
      toast.error(state.message);
    }
  }, [state, errors]);

  const needsLandArea = type === "terreno" || type === "parcela";

  return (
    <form action={formAction} className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Información general</h2>
        <Field name="title" label="Título" error={errors?.title} required>
          <Input
            id="title"
            name="title"
            value={text.title}
            onChange={(e) => setField("title", e.target.value)}
            aria-invalid={!!errors?.title}
            aria-describedby={errors?.title ? fieldErrorId("title") : undefined}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="operation" label="Operación" required>
            <Select
              id="operation"
              name="operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value as typeof operation)}
            >
              {OPERATIONS.map((op) => (
                <option key={op} value={op}>
                  {OPERATION_LABEL[op]}
                </option>
              ))}
            </Select>
          </Field>
          <Field name="type" label="Tipo de propiedad" required>
            <Select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field name="description" label="Descripción" error={errors?.description} required>
          <Textarea
            id="description"
            name="description"
            value={text.description}
            onChange={(e) => setField("description", e.target.value)}
            aria-invalid={!!errors?.description}
            aria-describedby={errors?.description ? fieldErrorId("description") : undefined}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Ubicación</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="zoneSlug" label="Zona" error={errors?.zoneSlug} required>
            <Select
              id="zoneSlug"
              name="zoneSlug"
              value={zoneSlug}
              onChange={(e) => setZoneSlug(e.target.value)}
            >
              {zones.map((zone) => (
                <option key={zone.slug} value={zone.slug}>
                  {zone.name}
                </option>
              ))}
              <option value={CUSTOM_ZONE_VALUE}>Otra zona…</option>
            </Select>
          </Field>

          {zoneSlug === CUSTOM_ZONE_VALUE && (
            <Field name="customZoneName" label="Nombre de la nueva zona" error={errors?.customZoneName} required>
              <Input
                id="customZoneName"
                name="customZoneName"
                value={text.customZoneName}
                onChange={(e) => setField("customZoneName", e.target.value)}
              />
            </Field>
          )}

          <Field name="commune" label="Comuna" error={errors?.commune} required>
            <Input
              id="commune"
              name="commune"
              value={text.commune}
              onChange={(e) => setField("commune", e.target.value)}
            />
          </Field>
          <Field name="city" label="Ciudad" hint="Opcional">
            <Input
              id="city"
              name="city"
              value={text.city}
              onChange={(e) => setField("city", e.target.value)}
            />
          </Field>
        </div>
        <Field name="addressHint" label="Referencia de ubicación" hint="Aproximada — nunca una dirección exacta">
          <Input
            id="addressHint"
            name="addressHint"
            value={text.addressHint}
            onChange={(e) => setField("addressHint", e.target.value)}
          />
        </Field>
        <Field
          name="mapsUrl"
          label="Link de Google Maps"
          error={errors?.mapsUrl}
          hint="Opcional — búscala en Google Maps, copia el link y pégalo aquí"
        >
          <Input
            id="mapsUrl"
            name="mapsUrl"
            placeholder="https://maps.app.goo.gl/..."
            value={text.mapsUrl}
            onChange={(e) => setField("mapsUrl", e.target.value)}
            aria-invalid={!!errors?.mapsUrl}
            aria-describedby={errors?.mapsUrl ? fieldErrorId("mapsUrl") : undefined}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Características</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field name="bedrooms" label="Dormitorios">
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              value={text.bedrooms}
              onChange={(e) => setField("bedrooms", e.target.value)}
            />
          </Field>
          <Field name="bathrooms" label="Baños">
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min={0}
              value={text.bathrooms}
              onChange={(e) => setField("bathrooms", e.target.value)}
            />
          </Field>
          <Field name="parkingSpaces" label="Estacionamientos">
            <Input
              id="parkingSpaces"
              name="parkingSpaces"
              type="number"
              min={0}
              value={text.parkingSpaces}
              onChange={(e) => setField("parkingSpaces", e.target.value)}
            />
          </Field>
          <Field name="builtAreaM2" label="Superficie construida (m²)">
            <Input
              id="builtAreaM2"
              name="builtAreaM2"
              type="number"
              min={0}
              value={text.builtAreaM2}
              onChange={(e) => setField("builtAreaM2", e.target.value)}
            />
          </Field>
          <Field
            name="landAreaM2"
            label="Superficie de terreno (m²)"
            error={errors?.landAreaM2}
            required={needsLandArea}
            hint={needsLandArea ? undefined : "Opcional"}
          >
            <Input
              id="landAreaM2"
              name="landAreaM2"
              type="number"
              min={0}
              value={text.landAreaM2}
              onChange={(e) => setField("landAreaM2", e.target.value)}
            />
          </Field>
        </div>
        <Field name="amenities" label="Características adicionales" hint="Sepáralas con comas — ej: Piscina, Quincho, Bodega">
          <Input
            id="amenities"
            name="amenities"
            value={text.amenities}
            onChange={(e) => setField("amenities", e.target.value)}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Galería</h2>
        <ImageUrlEditor defaultValue={property?.images} />
        {errors?.images && (
          <p className="text-xs text-danger-500" role="alert">
            {errors.images.join(" ")}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Precio y estado</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="priceAmount"
            label={`Precio (${operation === "venta" ? "UF" : "CLP"})`}
            error={errors?.priceAmount}
            required
          >
            <Input
              id="priceAmount"
              name="priceAmount"
              type="number"
              min={0}
              step="0.1"
              value={text.priceAmount}
              onChange={(e) => setField("priceAmount", e.target.value)}
              aria-invalid={!!errors?.priceAmount}
              aria-describedby={errors?.priceAmount ? fieldErrorId("priceAmount") : undefined}
            />
          </Field>
          <Field name="status" label="Estado">
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              {PROPERTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Destacada (aparece en Home)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publicada (visible en el sitio)
          </label>
        </div>
      </section>

      {state.status === "error" && !errors && (
        <p className="text-sm text-danger-500" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-cream-50/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : mode === "create" ? "Crear propiedad" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
