import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { getAgent } from "@/lib/data/agent";
import { listSubAdmins } from "@/lib/data/admin";
import { updateAgentAction } from "@/lib/actions/agent";
import { AgentProfileForm } from "@/components/dashboard/agent-profile-form";
import { TeamTable } from "@/components/dashboard/team-table";
import { ViewPageLink } from "@/components/dashboard/view-page-link";
import { ToastOnMount } from "@/components/dashboard/toast-on-mount";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Nosotros" };
export const instant = false;

export default async function NosotrosDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  await requireAdminPage();
  const { toast } = await searchParams;

  const [agent, accounts] = await Promise.all([getAgent(), listSubAdmins()]);

  return (
    <div className="space-y-10">
      {toast === "creada" && <ToastOnMount message="Cuenta creada." />}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Nosotros</h1>
          <p className="mt-1 text-sm text-muted-400">
            Todo lo que se muestra en la página pública Nosotros: tu perfil y el equipo.
          </p>
        </div>
        <ViewPageLink href="/nosotros" label="Ver Nosotros" />
      </div>

      <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
        <h2 className="font-display text-xl font-semibold text-cream-50">Perfil del agente</h2>
        <p className="mt-1 text-sm text-muted-400">
          Presentación principal: bio, estadísticas, credenciales y redes sociales.
        </p>
        <div className="mt-8">
          <AgentProfileForm agent={agent} action={updateAgentAction} />
        </div>
      </section>

      <div aria-hidden className="h-px bg-cream-50/10" />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-cream-50">Equipo</h2>
            <p className="mt-1 text-sm text-muted-400">
              Elige quién aparece debajo de tu perfil, y en qué orden.
            </p>
          </div>
          <Button as={Link} href="/dashboard/cuentas/nueva" size="sm">
            <Plus className="size-4" aria-hidden />
            Agregar agente
          </Button>
        </div>
        <TeamTable accounts={accounts} />
      </section>
    </div>
  );
}
