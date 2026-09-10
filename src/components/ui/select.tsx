import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-cream-50/10 bg-ink-900 px-3.5 pr-9 text-sm text-cream-50",
          "outline-none transition-colors duration-200 focus:border-gold-500 aria-invalid:border-danger-500",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-400"
      />
    </div>
  );
}
