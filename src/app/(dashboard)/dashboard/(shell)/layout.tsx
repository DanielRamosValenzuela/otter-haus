import type { ReactNode } from "react";
import { getCurrentAccount } from "@/lib/auth/dal";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const instant = false;

export default async function DashboardShellLayout({ children }: { children: ReactNode }) {
  const account = await getCurrentAccount();
  return <DashboardShell role={account.role}>{children}</DashboardShell>;
}
