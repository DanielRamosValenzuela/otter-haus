import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/dal";
import { getLegalGuide } from "@/lib/data/legal-guide";
import { updateLegalGuideAction } from "@/lib/actions/legal-guide";
import { LegalGuideForm } from "@/components/dashboard/legal-guide-form";
import { ViewPageLink } from "@/components/dashboard/view-page-link";

export const metadata: Metadata = { title: "Guía Legal" };
export const instant = false;

export default async function LegalGuideDashboardPage() {
  await requireAdminPage();
  const guide = await getLegalGuide();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Guía Legal</h1>
          <p className="mt-1 text-sm text-muted-400">
            Edita la introducción y las secciones de la página pública Guía Legal.
          </p>
        </div>
        <ViewPageLink href="/guia-legal" label="Ver Guía Legal" />
      </div>

      <LegalGuideForm guide={guide} action={updateLegalGuideAction} />
    </div>
  );
}
