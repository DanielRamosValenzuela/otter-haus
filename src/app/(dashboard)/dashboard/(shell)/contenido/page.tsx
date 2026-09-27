import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/dal";
import { getHomeContent } from "@/lib/data/home-content";
import { updateHomeContentAction } from "@/lib/actions/home-content";
import { HomeHeroForm } from "@/components/dashboard/home-hero-form";
import { ViewPageLink } from "@/components/dashboard/view-page-link";

export const metadata: Metadata = { title: "Contenido del sitio" };
export const instant = false;

export default async function ContenidoPage() {
  await requireAdminPage();

  const content = await getHomeContent();

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
    </div>
  );
}
