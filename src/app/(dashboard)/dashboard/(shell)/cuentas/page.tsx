import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountListSection } from "@/components/dashboard/account-list-section";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { ToastOnMount } from "@/components/dashboard/toast-on-mount";

export const metadata: Metadata = { title: "Cuentas" };

export const instant = false;

export default async function DashboardCuentasPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const { toast } = await searchParams;

  return (
    <>
      {toast === "creada" && <ToastOnMount message="Cuenta creada." />}
      <Suspense fallback={<TableSkeleton />}>
        <AccountListSection />
      </Suspense>
    </>
  );
}
