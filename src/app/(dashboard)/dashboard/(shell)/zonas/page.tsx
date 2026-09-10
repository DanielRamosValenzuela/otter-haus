import { Suspense } from "react";
import type { Metadata } from "next";
import { ZoneListSection } from "@/components/dashboard/zone-list-section";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { ToastOnMount } from "@/components/dashboard/toast-on-mount";

export const metadata: Metadata = { title: "Mis zonas" };

export const instant = false;

export default async function DashboardZonasPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const { toast } = await searchParams;

  return (
    <>
      {toast === "creada" && <ToastOnMount message="Zona creada." />}
      <Suspense fallback={<TableSkeleton />}>
        <ZoneListSection />
      </Suspense>
    </>
  );
}
