import { getCurrentAccount } from "@/lib/auth/dal";
import { LogoutButton } from "@/components/dashboard/logout-button";

export async function AdminBadge() {
  const account = await getCurrentAccount();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-cream-50">
          {account.name}
          {account.role === "sub_admin" && (
            <span className="ml-2 rounded-pill bg-cream-50/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-400">
              Sub admin
            </span>
          )}
        </p>
        <p className="text-xs text-muted-400">{account.email}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
