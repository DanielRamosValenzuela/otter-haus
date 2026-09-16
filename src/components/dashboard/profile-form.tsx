"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { AccountProfile } from "@/lib/types/admin";
import { IDLE_ACTION_STATE } from "@/lib/types/action-state";
import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadImageButton } from "@/components/dashboard/upload-image-button";
import { updateProfileAction } from "@/lib/actions/account";

export function ProfileForm({ account }: { account: AccountProfile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, IDLE_ACTION_STATE);
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  const [name, setName] = useState(account.name);
  const [roleTitle, setRoleTitle] = useState(account.roleTitle ?? "");
  const [bio, setBio] = useState(account.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(account.photoUrl ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    else if (state.status === "error" && !errors) toast.error(state.message);
  }, [state, errors]);

  const trimmedPhotoUrl = photoUrl.trim();
  const showPreview = isAllowedImageUrl(trimmedPhotoUrl);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div className="space-y-4">
          <Field name="name" label="Nombre" error={errors?.name} required>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors?.name}
              aria-describedby={errors?.name ? fieldErrorId("name") : undefined}
            />
          </Field>
          <Field name="roleTitle" label="Cargo" error={errors?.roleTitle} hint="Opcional">
            <Input
              id="roleTitle"
              name="roleTitle"
              placeholder="Editor de contenido"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </Field>
        </div>

        <div className="scrim-scope relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-full border border-cream-50/10 bg-ink-800">
          {showPreview ? (
            <Image src={trimmedPhotoUrl} alt={name} fill sizes="160px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-400">
              <ImageOff className="size-6" aria-hidden />
            </div>
          )}
        </div>
      </div>

      <Field name="photoUrl" label="URL de la foto" error={errors?.photoUrl} hint="Opcional">
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

      <Field
        name="bio"
        label="Biografía"
        error={errors?.bio}
        hint="Se muestra en tu página pública de equipo"
      >
        <Textarea
          id="bio"
          name="bio"
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          aria-invalid={!!errors?.bio}
          aria-describedby={errors?.bio ? fieldErrorId("bio") : undefined}
        />
      </Field>

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
