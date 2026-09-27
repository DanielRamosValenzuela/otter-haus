"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";
import type { AccountProfile } from "@/lib/types/admin";
import { setAccountActiveAction } from "@/lib/actions/accounts";

export function AccountRowActions({ account }: { account: AccountProfile }) {
  const [pending, startTransition] = useTransition();

  function handleToggleActive() {
    startTransition(async () => {
      await setAccountActiveAction(account.id, !account.active);
      toast.success(account.active ? "Cuenta desactivada" : "Cuenta activada");
    });
  }

  return (
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
  );
}
