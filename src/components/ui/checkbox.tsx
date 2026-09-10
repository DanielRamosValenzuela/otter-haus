import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 rounded border-cream-50/20 bg-ink-900 text-gold-500",
        "accent-gold-500 outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
        className,
      )}
      {...props}
    />
  );
}
