import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/login-form";

export const metadata: Metadata = { title: "Ingresar" };

// One-off, always-dynamic page — reads searchParams directly, and gets
// nothing from static-shell prerendering (see the dashboard shell layout
// for the same reasoning).
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
        <div className="text-center">
          <span className="font-display text-2xl font-semibold">
            TRAN<span className="text-gold-500">HAUS</span>
          </span>
          <p className="mt-2 text-sm text-muted-400">Panel del corredor</p>
        </div>

        <div className="glass rounded-card p-6">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
