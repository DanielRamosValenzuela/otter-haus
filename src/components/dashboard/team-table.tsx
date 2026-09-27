import Image from "next/image";
import { User } from "lucide-react";
import type { AccountProfile } from "@/lib/types/admin";
import { TeamRowActions } from "@/components/dashboard/team-row-actions";
import { EmptyState } from "@/components/ui/empty-state";

export function TeamTable({ accounts }: { accounts: AccountProfile[] }) {
  if (accounts.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay agentes"
        description="Agrega el primero con el botón “Agregar agente”."
      />
    );
  }

  const featuredOrder = accounts
    .filter((a) => a.teamOrder != null)
    .sort((a, b) => (a.teamOrder ?? 0) - (b.teamOrder ?? 0))
    .map((a) => a.id);

  return (
    <div className="overflow-hidden rounded-card border border-cream-50/10">
      <table className="w-full text-sm">
        <thead className="border-b border-cream-50/10 bg-ink-900/60 text-left text-xs uppercase tracking-wide text-muted-400">
          <tr>
            <th className="px-4 py-3 font-medium">Agente</th>
            <th className="px-4 py-3 font-medium">En Nosotros</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-50/5">
          {accounts.map((account) => {
            const featuredIndex = featuredOrder.indexOf(account.id);
            const isFeatured = featuredIndex !== -1;

            return (
              <tr key={account.id} className="transition-colors hover:bg-cream-50/[0.03]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cream-50/10 bg-ink-800">
                      {account.photoUrl ? (
                        <Image
                          src={account.photoUrl}
                          alt={account.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="size-4 text-muted-400" aria-hidden />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-cream-50">{account.name}</p>
                      {account.roleTitle && (
                        <p className="text-xs text-muted-400">{account.roleTitle}</p>
                      )}
                      {!account.active && (
                        <p className="text-xs text-danger-500">Cuenta desactivada</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {isFeatured ? (
                    <span className="text-gold-400">#{featuredIndex + 1} en equipo</span>
                  ) : (
                    <span className="text-muted-400">No se muestra</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <TeamRowActions
                      account={account}
                      isFirstFeatured={isFeatured && featuredIndex === 0}
                      isLastFeatured={isFeatured && featuredIndex === featuredOrder.length - 1}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
