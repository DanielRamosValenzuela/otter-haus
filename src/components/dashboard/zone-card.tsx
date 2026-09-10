"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2, MapPin } from "lucide-react";
import type { Zone } from "@/lib/types/zone";
import { deleteZoneAction } from "@/lib/actions/zones";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/utils/format";

export function ZoneCard({ zone }: { zone: Zone }) {
  const [, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      await deleteZoneAction(zone.slug);
      toast.success("Zona eliminada");
    });
  }

  return (
    <div className="group overflow-hidden rounded-card border border-cream-50/10 bg-ink-900 transition-[transform,box-shadow] duration-300 ease-lux hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-video overflow-hidden bg-ink-800">
        {zone.imageUrl ? (
          <Image
            src={zone.imageUrl}
            alt={zone.name}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 ease-lux group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MapPin className="size-10 text-muted-500" aria-hidden />
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-2 font-display text-lg font-semibold text-cream-50">
            {zone.name}
          </h3>
          {zone.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-400">{zone.description}</p>
          )}
        </div>

        <p className="text-xs text-muted-400">
          {zone.propertyCount} {pluralize(zone.propertyCount, "propiedad", "propiedades")}
        </p>

        <div className="flex items-center justify-end gap-1 border-t border-cream-50/10 pt-3">
          <Link
            href={`/dashboard/zonas/${zone.slug}/editar`}
            title="Editar"
            className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <ConfirmDialog
            title={`¿Eliminar "${zone.name}"?`}
            description="Esta acción no se puede deshacer. La zona se eliminará permanentemente."
            confirmLabel="Eliminar"
            destructive
            onConfirm={handleDelete}
            trigger={
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Eliminar"
                  className="size-8 p-0 text-muted-400 hover:bg-danger-500/15 hover:text-danger-500"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </DialogTrigger>
            }
          />
        </div>
      </div>
    </div>
  );
}
