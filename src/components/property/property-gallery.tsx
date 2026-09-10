"use client";

import { useState, Fragment } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { PropertyImage } from "@/lib/types/property";
import { cn } from "@/lib/utils/cn";

export function PropertyGallery({
  images,
  transitionName,
}: {
  images: PropertyImage[];
  transitionName?: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-card sm:h-[480px]">
        {images.slice(0, 5).map((image, index) => {
          const tile = (
            <button
              onClick={() => setLightboxIndex(index)}
              className={cn(
                "group relative overflow-hidden",
                index === 0 ? "col-span-4 row-span-2 h-64 sm:col-span-2 sm:row-span-2 sm:h-auto" : "col-span-2 h-32 sm:col-span-1 sm:h-auto",
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                priority={index === 0}
                className="object-cover transition-transform duration-500 ease-lux group-hover:scale-105"
              />
              {index === 4 && images.length > 5 && (
                <div className="scrim-scope absolute inset-0 flex items-center justify-center bg-scrim/60 text-sm font-medium text-cream-50">
                  +{images.length - 5} fotos
                </div>
              )}
            </button>
          );

          if (index === 0 && transitionName) {
            return (
              <ViewTransition key={image.url} name={transitionName} share="morph" default="none">
                {tile}
              </ViewTransition>
            );
          }
          return <Fragment key={image.url}>{tile}</Fragment>;
        })}
      </div>

      <button
        onClick={() => setLightboxIndex(0)}
        className="mt-3 inline-flex items-center gap-2 text-sm text-muted-400 transition-colors hover:text-gold-400"
      >
        <Expand className="size-4" aria-hidden />
        Ver todas las fotos ({images.length})
      </button>

      <RadixDialog.Root open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-scrim/95" />
          <RadixDialog.Content
            className="scrim-scope dialog-content fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none"
            aria-describedby={undefined}
          >
            <RadixDialog.Title className="sr-only">Galería de fotos</RadixDialog.Title>
            <RadixDialog.Close
              aria-label="Cerrar galería"
              className="absolute right-4 top-4 rounded-full p-2 text-cream-50 hover:bg-cream-50/10"
            >
              <X className="size-6" aria-hidden />
            </RadixDialog.Close>

            {lightboxIndex !== null && (
              <>
                <div className="relative h-[70vh] w-full max-w-4xl">
                  <Image
                    src={images[lightboxIndex].url}
                    alt={images[lightboxIndex].alt}
                    fill
                    sizes="90vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="mt-4 text-sm text-muted-400">
                  {lightboxIndex + 1} / {images.length}
                </p>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setLightboxIndex((i) => (i! - 1 + images.length) % images.length)}
                      aria-label="Foto anterior"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-cream-50 hover:bg-cream-50/10"
                    >
                      <ChevronLeft className="size-8" aria-hidden />
                    </button>
                    <button
                      onClick={() => setLightboxIndex((i) => (i! + 1) % images.length)}
                      aria-label="Foto siguiente"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-cream-50 hover:bg-cream-50/10"
                    >
                      <ChevronRight className="size-8" aria-hidden />
                    </button>
                  </>
                )}
              </>
            )}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </>
  );
}
