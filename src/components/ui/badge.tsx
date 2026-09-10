import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const TONES = {
  gold: "bg-gold-500/15 text-gold-400 border-gold-500/30",
  success: "bg-success-500/15 text-success-500 border-success-500/30",
  warning: "bg-warning-500/15 text-warning-500 border-warning-500/30",
  danger: "bg-danger-500/15 text-danger-500 border-danger-500/30",
  neutral: "bg-cream-50/5 text-muted-400 border-cream-50/10",
} as const;

type BadgeTone = keyof typeof TONES;

interface BadgeOwnProps {
  tone?: BadgeTone;
}

export type BadgeProps = BadgeOwnProps & ComponentProps<"span">;

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-xs font-medium uppercase tracking-wide",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
