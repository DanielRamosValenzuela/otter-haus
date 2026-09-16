import type { AccountProfile } from "@/lib/types/admin";
import { Badge } from "@/components/ui/badge";
import { AccountRowActions } from "@/components/dashboard/account-row-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";

export function AccountTable({ accounts }: { accounts: AccountProfile[] }) {
  if (accounts.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay sub-administradores"
        description="Crea la primera cuenta con el botón “Nueva cuenta”."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-cream-50/10">
      <table className="w-full text-sm">
        <thead className="border-b border-cream-50/10 bg-ink-900/60 text-left text-xs uppercase tracking-wide text-muted-400">
          <tr>
            <th className="px-4 py-3 font-medium">Cuenta</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Correo</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Creada</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-50/5">
          {accounts.map((account) => (
            <tr key={account.id} className="transition-colors hover:bg-cream-50/[0.03]">
              <td className="px-4 py-3">
                <p className="font-medium text-cream-50">{account.name}</p>
                {account.roleTitle && (
                  <p className="text-xs text-muted-400">{account.roleTitle}</p>
                )}
              </td>
              <td className="hidden px-4 py-3 text-muted-400 sm:table-cell">{account.email}</td>
              <td className="hidden px-4 py-3 text-muted-400 md:table-cell">
                {formatDate(account.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Badge tone={account.active ? "success" : "neutral"}>
                  {account.active ? "Activa" : "Desactivada"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end">
                  <AccountRowActions account={account} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
