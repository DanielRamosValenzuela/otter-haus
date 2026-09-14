import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";

export const metadata: Metadata = { title: "Cuenta" };
export const instant = false;

export default async function CuentaPage() {
  const admin = await getCurrentAdmin();

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-semibold">Cuenta</h1>

      <section className="rounded-card border border-cream-50/10 bg-ink-900 p-6 shadow-lift sm:p-8">
        <h2 className="font-display text-xl font-semibold text-cream-50">Sesión</h2>
        <p className="mt-1 text-sm text-muted-400">
          Ingresas como <span className="text-cream-50">{admin.name}</span> ({admin.email}).
        </p>
      </section>

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
