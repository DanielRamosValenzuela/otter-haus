import { Suspense } from "react";
import type { Metadata } from "next";
import { PropertyTableSection } from "@/components/dashboard/property-table-section";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";
import { ToastOnMount } from "@/components/dashboard/toast-on-mount";

export const metadata: Metadata = { title: "Mis propiedades" };

export const instant = false;

export default async function DashboardPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const { toast } = await searchParams;

  return (
    <>
      {toast === "creada" && <ToastOnMount message="Propiedad creada." />}
      <Suspense fallback={<TableSkeleton />}>
        <PropertyTableSection />
      </Suspense>
    </>
  );
}
