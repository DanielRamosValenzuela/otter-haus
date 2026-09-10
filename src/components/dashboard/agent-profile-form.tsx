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
                defaultValue={agent.name}
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? fieldErrorId("name") : undefined}
              />
            </Field>
            <Field name="role" label="Cargo" error={errors?.role} required>
              <Input
                id="role"
                name="role"
                defaultValue={agent.role}
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
            defaultValue={agent.shortBio}
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
            defaultValue={agent.bio}
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
              defaultValue={agent.email}
              aria-invalid={!!errors?.email}
              aria-describedby={errors?.email ? fieldErrorId("email") : undefined}
            />
          </Field>
          <Field name="phone" label="Teléfono" error={errors?.phone} required>
            <Input
              id="phone"
              name="phone"
              defaultValue={agent.phone}
              aria-invalid={!!errors?.phone}
              aria-describedby={errors?.phone ? fieldErrorId("phone") : undefined}
            />
          </Field>
          <Field name="whatsapp" label="WhatsApp" error={errors?.whatsapp} required>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={agent.whatsapp}
              aria-invalid={!!errors?.whatsapp}
              aria-describedby={errors?.whatsapp ? fieldErrorId("whatsapp") : undefined}
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
              defaultValue={agent.coverageZones.join(", ")}
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
              defaultValue={agent.credentials.join(", ")}
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
                defaultValue={agent.stats[0]?.label}
              />
            </Field>
            <Field name="stat1Value" label="Valor 1" error={errors?.stat1Value} required>
              <Input
                id="stat1Value"
                name="stat1Value"
                defaultValue={agent.stats[0]?.value}
              />
            </Field>
          </div>
          <div className="space-y-4">
            <Field name="stat2Label" label="Etiqueta 2" error={errors?.stat2Label} required>
              <Input
                id="stat2Label"
                name="stat2Label"
                defaultValue={agent.stats[1]?.label}
              />
            </Field>
            <Field name="stat2Value" label="Valor 2" error={errors?.stat2Value} required>
              <Input
                id="stat2Value"
                name="stat2Value"
                defaultValue={agent.stats[1]?.value}
              />
            </Field>
          </div>
          <div className="space-y-4">
            <Field name="stat3Label" label="Etiqueta 3" error={errors?.stat3Label} required>
              <Input
                id="stat3Label"
                name="stat3Label"
                defaultValue={agent.stats[2]?.label}
              />
            </Field>
            <Field name="stat3Value" label="Valor 3" error={errors?.stat3Value} required>
              <Input
                id="stat3Value"
                name="stat3Value"
                defaultValue={agent.stats[2]?.value}
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
                defaultValue={socialUrl(agent, "instagram")}
              />
            </div>
          </Field>
          <Field name="facebookUrl" label="Facebook" error={errors?.facebookUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <FacebookIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={socialUrl(agent, "facebook")}
              />
            </div>
          </Field>
          <Field name="linkedinUrl" label="LinkedIn" error={errors?.linkedinUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <LinkedInIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                defaultValue={socialUrl(agent, "linkedin")}
              />
            </div>
          </Field>
          <Field name="youtubeUrl" label="YouTube" error={errors?.youtubeUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <YouTubeIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                defaultValue={socialUrl(agent, "youtube")}
              />
            </div>
          </Field>
          <Field name="tiktokUrl" label="TikTok" error={errors?.tiktokUrl} hint="Opcional">
            <div className="flex items-center gap-2">
              <TikTokIcon className="size-5 shrink-0 text-muted-400" />
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                defaultValue={socialUrl(agent, "tiktok")}
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
