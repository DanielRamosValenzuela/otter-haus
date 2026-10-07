import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/dal";
import { getHomeContent } from "@/lib/data/home-content";
import { getAgent } from "@/lib/data/agent";
import { updateHomeContentAction } from "@/lib/actions/home-content";
import { updateAgentAction } from "@/lib/actions/agent";
import { HomeHeroForm } from "@/components/dashboard/home-hero-form";
import { AgentProfileForm } from "@/components/dashboard/agent-profile-form";
import { ViewPageLink } from "@/components/dashboard/view-page-link";

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
            <h2 className="font-display text-xl font-semibold text-cream-50">Portada y pie de página</h2>
            <p className="mt-1 text-sm text-muted-400">
              Hero, secciones, equipo y pie de página de la portada (Inicio): textos, enlaces, imagen y visibilidad.
            </p>
          </div>
          <ViewPageLink href="/" label="Ver Inicio" />
        </div>
        <div className="mt-8">
          <HomeHeroForm content={content} action={updateHomeContentAction} />
        </div>
      </section>

      <section
        id="perfil-corredora"
        className="scroll-mt-24 rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-cream-50">
              Perfil de la corredora
            </h2>
            <p className="mt-1 text-sm text-muted-400">
              Foto, biografía corta (portada y Noticias), biografía completa, estadísticas,
              credenciales y redes sociales. Se muestra en la portada, en Noticias y en Nosotros.
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
