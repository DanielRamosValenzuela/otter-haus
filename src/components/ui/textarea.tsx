import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea({ className, rows = 5, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-lg border border-cream-50/10 bg-ink-900 px-3.5 py-3 text-sm text-cream-50",
        "placeholder:text-muted-500 outline-none transition-colors duration-200 resize-y",
        "focus:border-gold-500 aria-invalid:border-danger-500",
        className,
      )}
      {...props}
    />
  );
}
