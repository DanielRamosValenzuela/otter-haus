import { getCurrentAdmin } from "@/lib/auth/dal";
import { LogoutButton } from "@/components/dashboard/logout-button";

export async function AdminBadge() {
  const admin = await getCurrentAdmin();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-cream-50">{admin.name}</p>
        <p className="text-xs text-muted-400">{admin.email}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
