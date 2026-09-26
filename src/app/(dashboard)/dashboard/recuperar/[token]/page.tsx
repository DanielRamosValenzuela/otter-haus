import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/dashboard/reset-password-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: "Restablecer contraseña" };

export const instant = false;

type Params = Promise<{ token: string }>;

export default async function RecuperarTokenPage({ params }: { params: Params }) {
  const { token } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="md" priority />
          <p className="mt-2 text-sm text-muted-400">Elige una nueva contraseña</p>
        </div>

        <div className="glass rounded-card p-6">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
