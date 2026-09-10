import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function inputStyles(className?: string) {
  return cn(
    "h-11 w-full rounded-lg border border-cream-50/10 bg-ink-900 px-3.5 text-sm text-cream-50",
    "placeholder:text-muted-500 outline-none transition-colors duration-200",
    "focus:border-gold-500 aria-invalid:border-danger-500",
    className,
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={inputStyles(className)} {...props} />;
}
