"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ChevronUp, ChevronDown, ImageOff } from "lucide-react";
import type { PropertyImage } from "@/lib/types/property";
import { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS } from "@/lib/images/allowed-hosts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ImageUrlEditor({ defaultValue = [] }: { defaultValue?: PropertyImage[] }) {
  const [images, setImages] = useState<PropertyImage[]>(defaultValue);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addImage() {
    if (!url.trim() || !alt.trim()) {
      setError("Completa la URL y la descripción de la imagen.");
      return;
    }
    if (!isAllowedImageUrl(url.trim())) {
      setError(`Solo se permiten imágenes de: ${ALLOWED_IMAGE_HOSTS.join(", ")}`);
      return;
    }
    setImages((prev) => [...prev, { url: url.trim(), alt: alt.trim() }]);
    setUrl("");
    setAlt("");
    setError(null);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="scrim-scope group relative overflow-hidden rounded-lg border border-cream-50/10">
              <div className="relative aspect-square bg-ink-800">
                <Image src={image.url} alt={image.alt} fill sizes="150px" className="object-cover" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-scrim/70 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="rounded bg-ink-900 p-1.5 text-cream-50 disabled:opacity-30"
                    aria-label="Mover antes"
                  >
                    <ChevronUp className="size-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded bg-ink-900 p-1.5 text-cream-50 disabled:opacity-30"
                    aria-label="Mover después"
                  >
                    <ChevronDown className="size-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded bg-danger-500/80 p-1.5 text-white"
                    aria-label="Quitar imagen"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </div>
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-scrim/80 px-1.5 py-0.5 text-[10px] font-medium text-gold-400">
                  Portada
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-cream-50/15 py-8 text-center text-muted-400">
          <ImageOff className="size-6" aria-hidden />
          <p className="text-sm">Aún no agregas imágenes</p>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          placeholder="https://images.unsplash.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          placeholder="Descripción de la imagen (alt)"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={addImage}>
          <Plus className="size-4" aria-hidden />
          Agregar
        </Button>
      </div>
      {error && (
        <p className="text-xs text-danger-500" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-500">
        Por ahora se agregan por URL desde {ALLOWED_IMAGE_HOSTS.join(" o ")}. La primera imagen es
        la portada — usa las flechas para reordenar.
      </p>
    </div>
  );
}
