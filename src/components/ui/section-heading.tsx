import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center", className)}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && <p className="max-w-2xl text-muted-400">{description}</p>}
    </div>
  );
}
