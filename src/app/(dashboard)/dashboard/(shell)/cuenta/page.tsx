import type { Metadata } from "next";
import { getCurrentAccount } from "@/lib/auth/dal";
import { getAccountProfile } from "@/lib/data/admin";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = { title: "Cuenta" };
export const instant = false;

export default async function CuentaPage() {
  const account = await getCurrentAccount();
  const profile = account.role === "sub_admin" ? await getAccountProfile(account.id) : null;

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-semibold">Cuenta</h1>

      <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
        <h2 className="font-display text-xl font-semibold text-cream-50">Sesión</h2>
        <p className="mt-1 text-sm text-muted-400">
          Ingresas como <span className="text-cream-50">{account.name}</span> ({account.email}).
        </p>
      </section>

      {profile && (
        <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
          <h2 className="font-display text-xl font-semibold text-cream-50">Perfil público</h2>
          <p className="mt-1 text-sm text-muted-400">
            Se muestra como firma en tus noticias y en tu página de equipo.
          </p>
          <div className="mt-8 max-w-lg">
            <ProfileForm account={profile} />
          </div>
        </section>
      )}

      <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
        <h2 className="font-display text-xl font-semibold text-cream-50">Contraseña</h2>
        <p className="mt-1 text-sm text-muted-400">Cambia la contraseña de acceso al panel.</p>
        <div className="mt-8 max-w-md">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
