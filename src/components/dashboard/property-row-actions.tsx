"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Star, StarOff } from "lucide-react";
import type { Property } from "@/lib/types/property";
import {
  deletePropertyAction,
  toggleFeaturedAction,
  togglePublishedAction,
} from "@/lib/actions/properties";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PropertyRowActions({ property }: { property: Property }) {
  const [pending, startTransition] = useTransition();

  function handleTogglePublished() {
    startTransition(async () => {
      await togglePublishedAction(property.id, !property.published);
      toast.success(property.published ? "Propiedad despublicada" : "Propiedad publicada");
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      await toggleFeaturedAction(property.id, !property.featured);
      toast.success(property.featured ? "Quitada de destacadas" : "Marcada como destacada");
    });
  }

  async function handleDelete() {
    await deletePropertyAction(property.id);
    toast.success("Propiedad eliminada");
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={handleToggleFeatured}
        disabled={pending}
        title={property.featured ? "Quitar de destacadas" : "Marcar como destacada"}
        className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-gold-400 disabled:opacity-50"
      >
        {property.featured ? <Star className="size-4 fill-current" aria-hidden /> : <StarOff className="size-4" aria-hidden />}
      </button>

      <button
        onClick={handleTogglePublished}
        disabled={pending}
        title={property.published ? "Despublicar" : "Publicar"}
        className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50 disabled:opacity-50"
      >
        {property.published ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
      </button>

      <Link
        href={`/dashboard/propiedades/${property.id}/editar`}
        title="Editar"
        className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
      >
        <Pencil className="size-4" aria-hidden />
      </Link>

      <ConfirmDialog
        title={`¿Eliminar "${property.title}"?`}
        description="Esta acción no se puede deshacer. La propiedad se eliminará permanentemente."
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
  );
}
