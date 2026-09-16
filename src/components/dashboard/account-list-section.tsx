import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { listSubAdmins } from "@/lib/data/admin";
import { AccountTable } from "@/components/dashboard/account-table";
import { Button } from "@/components/ui/button";

export async function AccountListSection() {
  await requireAdminPage();
  const accounts = await listSubAdmins();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Cuentas</h1>
          <p className="text-sm text-muted-400">{accounts.length} en total</p>
        </div>
        <Button as={Link} href="/dashboard/cuentas/nueva" size="sm">
          <Plus className="size-4" aria-hidden />
          Nueva cuenta
        </Button>
      </div>
      <AccountTable accounts={accounts} />
    </div>
  );
}
