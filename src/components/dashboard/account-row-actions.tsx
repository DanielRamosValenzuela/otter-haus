"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Star, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { AccountProfile } from "@/lib/types/admin";
import {
  moveAccountTeamOrderAction,
  setAccountActiveAction,
  setAccountTeamFeaturedAction,
} from "@/lib/actions/accounts";

export function AccountRowActions({
  account,
  isFirstFeatured,
  isLastFeatured,
}: {
  account: AccountProfile;
  isFirstFeatured: boolean;
  isLastFeatured: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const isFeatured = account.teamOrder != null;

  function handleToggleActive() {
    startTransition(async () => {
      await setAccountActiveAction(account.id, !account.active);
      toast.success(account.active ? "Cuenta desactivada" : "Cuenta activada");
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      await setAccountTeamFeaturedAction(account.id, !isFeatured);
      toast.success(isFeatured ? "Se dejó de mostrar en Nosotros" : "Ahora se muestra en Nosotros");
    });
  }

  function handleMove(direction: "up" | "down") {
    startTransition(async () => {
      await moveAccountTeamOrderAction(account.id, direction);
    });
  }

  return (
    <>
      {isFeatured && (
        <>
          <button
            onClick={() => handleMove("up")}
            disabled={pending || isFirstFeatured}
            title="Subir en el equipo"
            className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50 disabled:opacity-30"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => handleMove("down")}
            disabled={pending || isLastFeatured}
            title="Bajar en el equipo"
            className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50 disabled:opacity-30"
          >
            <ArrowDown className="size-4" aria-hidden />
          </button>
        </>
      )}
      <button
        onClick={handleToggleFeatured}
        disabled={pending}
        title={isFeatured ? "Dejar de mostrar en Nosotros" : "Mostrar en Nosotros"}
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
          isFeatured
            ? "border-gold-500/40 bg-gold-500/10 text-gold-400 hover:bg-gold-500/15"
            : "border-cream-50/15 text-muted-400 hover:border-cream-50/30 hover:text-cream-50",
        )}
      >
        <Star className={cn("size-3.5", isFeatured && "fill-current")} aria-hidden />
        <span className="hidden sm:inline">
          {isFeatured ? "En Nosotros" : "Mostrar en Nosotros"}
        </span>
      </button>
      <button
        onClick={handleToggleActive}
        disabled={pending}
        title={account.active ? "Desactivar cuenta" : "Activar cuenta"}
        className="flex size-8 items-center justify-center rounded-lg text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50 disabled:opacity-50"
      >
        {account.active ? (
          <UserX className="size-4" aria-hidden />
        ) : (
          <UserCheck className="size-4" aria-hidden />
        )}
      </button>
    </>
  );
}
