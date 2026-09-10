import Link from "next/link";
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function DashboardNav() {
  return (
    <div className="flex items-center gap-6">
      <Link href="/dashboard/propiedades" className="font-display text-xl font-semibold">
        TRAN<span className="text-gold-500">HAUS</span>
      </Link>
      <span className="hidden text-sm text-muted-400 sm:inline">Panel del corredor</span>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button as={Link} href="/dashboard/propiedades/nueva" size="sm">
          <Plus className="size-4" aria-hidden />
          Nueva propiedad
        </Button>
      </div>
    </div>
  );
}
