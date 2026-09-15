"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { Agent } from "@/lib/types/agent";
import type { ActionState } from "@/lib/types/action-state";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadImageButton } from "@/components/dashboard/upload-image-button";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  YouTubeIcon,
  TikTokIcon,
} from "@/components/icons/social-icons";

function socialUrl(agent: Agent, platform: string): string {
  return agent.socials.find((s) => s.platform === platform)?.url ?? "";
}

interface TextValues {
  name: string;
  role: string;
  shortBio: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  notificationEmail: string;
  whatsappMessage: string;
  coverageZones: string;
  credentials: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
}

export function AgentProfileForm({
  agent,
  action,
}: {
  agent: Agent;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const [photoUrl, setPhotoUrl] = useState(agent.photoUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [text, setText] = useState<TextValues>({
    name: agent.name,
    role: agent.role,
    shortBio: agent.shortBio,
    bio: agent.bio,
    email: agent.email,
    phone: agent.phone,
    whatsapp: agent.whatsapp,
    notificationEmail: agent.notificationEmail,
    whatsappMessage: agent.whatsappMessage,
    coverageZones: agent.coverageZones.join(", "),
    credentials: agent.credentials.join(", "),
    stat1Label: agent.stats[0]?.label ?? "",
    stat1Value: agent.stats[0]?.value ?? "",
    stat2Label: agent.stats[1]?.label ?? "",
    stat2Value: agent.stats[1]?.value ?? "",
    stat3Label: agent.stats[2]?.label ?? "",
    stat3Value: agent.stats[2]?.value ?? "",
    instagramUrl: socialUrl(agent, "instagram"),
    facebookUrl: socialUrl(agent, "facebook"),
    linkedinUrl: socialUrl(agent, "linkedin"),
    youtubeUrl: socialUrl(agent, "youtube"),
    tiktokUrl: socialUrl(agent, "tiktok"),
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

  const trimmedPhotoUrl = photoUrl.trim();
  const showPreview = isAllowedImageUrl(trimmedPhotoUrl);

  return (
    <form action={formAction} className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Perfil</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <div className="space-y-4">
            <Field name="name" label="Nombre" error={errors?.name} required>
              <Input
                id="name"
                name="name"
                value={text.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? fieldErrorId("name") : undefined}
              />
            </Field>
            <Field name="role" label="Cargo" error={errors?.role} required>
              <Input
                id="role"
                name="role"
                value={text.role}
                onChange={(e) => setField("role", e.target.value)}
                aria-invalid={!!errors?.role}
                aria-describedby={errors?.role ? fieldErrorId("role") : undefined}
              />
            </Field>
            <Field name="photoUrl" label="URL de la foto" error={errors?.photoUrl} required>
              <Input
                id="photoUrl"
                name="photoUrl"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                aria-invalid={!!errors?.photoUrl}
                aria-describedby={errors?.photoUrl ? fieldErrorId("photoUrl") : undefined}
              />
            </Field>
            <UploadImageButton
              onUploaded={(uploadedUrl) => {
                setPhotoUrl(uploadedUrl);
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

          <div className="scrim-scope relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-full border border-cream-50/10 bg-ink-800">
            {showPreview ? (
              <Image
                src={trimmedPhotoUrl}
                alt={agent.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-400">
                <ImageOff className="size-6" aria-hidden />
              </div>
            )}
          </div>
        </div>

        <Field
          name="shortBio"
          label="Biografía corta"
          error={errors?.shortBio}
          hint="Resumen corto usado en tarjetas"
          required
        >
          <Textarea
            id="shortBio"
            name="shortBio"
            rows={3}
            value={text.shortBio}
            onChange={(e) => setField("shortBio", e.target.value)}
            aria-invalid={!!errors?.shortBio}
            aria-describedby={errors?.shortBio ? fieldErrorId("shortBio") : undefined}
          />
        </Field>

        <Field
          name="bio"
          label="Biografía completa"
          error={errors?.bio}
          hint="Biografía completa, usada en la página Nosotros"
          required
        >
          <Textarea
            id="bio"
            name="bio"
            rows={8}
            value={text.bio}
            onChange={(e) => setField("bio", e.target.value)}
            aria-invalid={!!errors?.bio}
            aria-describedby={errors?.bio ? fieldErrorId("bio") : undefined}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Contacto</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="email" label="Correo" error={errors?.email} required>
            <Input
              id="email"
              name="email"
              type="email"
              value={text.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!errors?.email}
              aria-describedby={errors?.email ? fieldErrorId("email") : undefined}
            />
          </Field>
          <Field name="phone" label="Teléfono" error={errors?.phone} required>
            <Input
              id="phone"
              name="phone"
              value={text.phone}
              onChange={(e) => setField("phone", e.target.value)}
              aria-invalid={!!errors?.phone}
              aria-describedby={errors?.phone ? fieldErrorId("phone") : undefined}
            />
          </Field>
          <Field name="whatsapp" label="WhatsApp" error={errors?.whatsapp} required>
            <Input
              id="whatsapp"
              name="whatsapp"
              value={text.whatsapp}
              onChange={(e) => setField("whatsapp", e.target.value)}
              aria-invalid={!!errors?.whatsapp}
              aria-describedby={errors?.whatsapp ? fieldErrorId("whatsapp") : undefined}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="notificationEmail"
            label="Correo para notificaciones"
            error={errors?.notificationEmail}
            hint="Ahí llegan los mensajes del formulario de contacto"
            required
          >
            <Input
              id="notificationEmail"
              name="notificationEmail"
              type="email"
              value={text.notificationEmail}
              onChange={(e) => setField("notificationEmail", e.target.value)}
              aria-invalid={!!errors?.notificationEmail}
              aria-describedby={
                errors?.notificationEmail ? fieldErrorId("notificationEmail") : undefined
              }
            />
          </Field>
          <Field
            name="whatsappMessage"
            label="Mensaje inicial de WhatsApp"
            error={errors?.whatsappMessage}
            hint="El que se pre-llena al escribir por el botón flotante"
            required
          >
            <Input
              id="whatsappMessage"
              name="whatsappMessage"
              value={text.whatsappMessage}
              onChange={(e) => setField("whatsappMessage", e.target.value)}
              aria-invalid={!!errors?.whatsappMessage}
              aria-describedby={
                errors?.whatsappMessage ? fieldErrorId("whatsappMessage") : undefined
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="coverageZones"
            label="Zonas de cobertura"
            error={errors?.coverageZones}
            hint="Sepáralas con comas"
          >
            <Input
              id="coverageZones"
              name="coverageZones"
              value={text.coverageZones}
              onChange={(e) => setField("coverageZones", e.target.value)}
            />
          </Field>
          <Field
            name="credentials"
            label="Credenciales"
            error={errors?.credentials}
            hint="Sepáralas con comas"
          >
            <Input
              id="credentials"
              name="credentials"
              value={text.credentials}
              onChange={(e) => setField("credentials", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Estadísticas</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-4">
            <Field name="stat1Label" label="Etiqueta 1" error={errors?.stat1Label} required>
              <Input
                id="stat1Label"
                name="stat1Label"
                value={text.stat1Label}
                onChange={(e) => setField("stat1Label", e.target.value)}
              />
            </Field>
            <Field name="stat1Value" label="Valor 1" error={errors?.stat1Value} required>
              <Input
                id="stat1Value"
                name="stat1Value"
                value={text.stat1Value}
                onChange={(e) => setField("stat1Value", e.target.value)}
              />
            </Field>
          </div>
          <div className="space-y-4">
            <Field name="stat2Label" label="Etiqueta 2" error={errors?.stat2Label} required>
              <Input
                id="stat2Label"
                name="stat2Label"
                value={text.stat2Label}
                onChange={(e) => setField("stat2Label", e.target.value)}
              />
            </Field>
            <Field name="stat2Value" label="Valor 2" error={errors?.stat2Value} required>
              <Input
                id="stat2Value"
                name="stat2Value"
                value={text.stat2Value}
                onChange={(e) => setField("stat2Value", e.target.value)}
              />
            </Field>
          </div>
          <div className="space-y-4">
            <Field name="stat3Label" label="Etiqueta 3" error={errors?.stat3Label} required>
              <Input
                id="stat3Label"
                name="stat3Label"
                value={text.stat3Label}
                onChange={(e) => setField("stat3Label", e.target.value)}
              />
            </Field>
            <Field name="stat3Value" label="Valor 3" error={errors?.stat3Value} required>
              <Input
                id="stat3Value"
                name="stat3Value"
                value={text.stat3Value}
                onChange={(e) => setField("stat3Value", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-gold-400">Redes sociales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="instagramUrl" label="Instagram" error={errors?.instagramUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <InstagramIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="instagramUrl"
                name="instagramUrl"
                value={text.instagramUrl}
                onChange={(e) => setField("instagramUrl", e.target.value)}
              />
            </div>
          </Field>
          <Field name="facebookUrl" label="Facebook" error={errors?.facebookUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <FacebookIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="facebookUrl"
                name="facebookUrl"
                value={text.facebookUrl}
                onChange={(e) => setField("facebookUrl", e.target.value)}
              />
            </div>
          </Field>
          <Field name="linkedinUrl" label="LinkedIn" error={errors?.linkedinUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <LinkedInIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={text.linkedinUrl}
                onChange={(e) => setField("linkedinUrl", e.target.value)}
              />
            </div>
          </Field>
          <Field name="youtubeUrl" label="YouTube" error={errors?.youtubeUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <YouTubeIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                value={text.youtubeUrl}
                onChange={(e) => setField("youtubeUrl", e.target.value)}
              />
            </div>
          </Field>
          <Field name="tiktokUrl" label="TikTok" error={errors?.tiktokUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <TikTokIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                value={text.tiktokUrl}
                onChange={(e) => setField("tiktokUrl", e.target.value)}
              />
            </div>
          </Field>
        </div>
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
