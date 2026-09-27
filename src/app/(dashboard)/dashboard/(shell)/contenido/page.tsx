import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { getHomeContent } from "@/lib/data/home-content";
import { getAgent } from "@/lib/data/agent";
import { updateHomeContentAction } from "@/lib/actions/home-content";
import { updateAgentAction } from "@/lib/actions/agent";
import { HomeHeroForm } from "@/components/dashboard/home-hero-form";
import { AgentProfileForm } from "@/components/dashboard/agent-profile-form";

function ViewPageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden />
    </Link>
  );
}

export const metadata: Metadata = { title: "Contenido del sitio" };
export const instant = false;

export default async function ContenidoPage() {
  await requireAdminPage();

  const [content, agent] = await Promise.all([getHomeContent(), getAgent()]);

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-semibold">Contenido del sitio</h1>

      <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-cream-50">Portada</h2>
            <p className="mt-1 text-sm text-muted-400">
              Copy del hero y de los encabezados de las secciones de la portada (Inicio).
            </p>
          </div>
          <ViewPageLink href="/" label="Ver Inicio" />
        </div>
        <div className="mt-8">
          <HomeHeroForm content={content} action={updateHomeContentAction} />
        </div>
      </section>

      <div aria-hidden className="h-px bg-cream-50/10" />

      <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-cream-50">
              Perfil del agente
            </h2>
            <p className="mt-1 text-sm text-muted-400">
              Esto es lo que se muestra en la página pública <strong className="text-cream-50">Nosotros</strong>: bio,
              estadísticas, credenciales y redes sociales.
            </p>
          </div>
          <ViewPageLink href="/nosotros" label="Ver Nosotros" />
        </div>
        <div className="mt-8">
          <AgentProfileForm agent={agent} action={updateAgentAction} />
        </div>
      </section>
    </div>
  );
}
