import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountListSection } from "@/components/dashboard/account-list-section";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";

export const metadata: Metadata = { title: "Cuentas" };

export const instant = false;

export default function DashboardCuentasPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AccountListSection />
    </Suspense>
  );
}
