import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  primary:
    "bg-gold-500 text-scrim hover:bg-gold-400 shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]",
  outline:
    "border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-400",
  ghost: "text-cream-50 hover:bg-cream-50/5",
  danger: "bg-danger-500 text-cream-50 hover:bg-danger-500/85",
} as const;

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
} as const;

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

interface ButtonOwnProps<T extends ElementType> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: T;
}

export type ButtonProps<T extends ElementType = "button"> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends ElementType = "button">({
  variant = "primary",
  size = "md",
  as,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = (as ?? "button") as ElementType;
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill font-medium",
        "transition-[background-color,border-color,color,transform] duration-200 ease-lux",
        "disabled:opacity-50 disabled:pointer-events-none",
        "active:scale-[0.98]",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
