import type { Metadata } from "next";
import Link from "next/link";
import { RequestPasswordResetForm } from "@/components/dashboard/request-password-reset-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export const instant = false;

export default function RecuperarPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="md" priority />
          <p className="mt-2 text-sm text-muted-400">Recuperar contraseña</p>
        </div>

        <div className="glass rounded-card p-6">
          <RequestPasswordResetForm />
        </div>

        <p className="text-center text-sm text-muted-400">
          <Link href="/dashboard/login" className="text-cream-50 hover:text-gold-400">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
