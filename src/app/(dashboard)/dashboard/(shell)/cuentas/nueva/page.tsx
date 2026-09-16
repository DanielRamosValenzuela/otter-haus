import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth/dal";
import { CreateAccountForm } from "@/components/dashboard/create-account-form";

export const metadata: Metadata = { title: "Nueva cuenta" };
export const instant = false;

export default async function NuevaCuentaPage() {
  await requireAdminPage();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Nueva cuenta</h1>
        <p className="mt-1 text-sm text-muted-400">
          Crea una cuenta de sub-administrador. Podrá publicar propiedades y noticias, y editar
          su propio perfil público.
        </p>
      </div>
      <CreateAccountForm />
    </div>
  );
}
