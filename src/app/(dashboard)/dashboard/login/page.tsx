import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/login-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: "Ingresar" };

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="md" priority />
          <p className="mt-2 text-sm text-muted-400">Panel del corredor</p>
        </div>

        <div className="glass rounded-card p-6">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
