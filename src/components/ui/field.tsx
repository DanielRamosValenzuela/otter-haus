import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function fieldErrorId(name: string): string {
  return `${name}-error`;
}

interface FieldProps {
  name: string;
  label: string;
  error?: string[];
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ name, label, error, hint, required, className, children }: FieldProps) {
  const hasError = !!error?.length;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-sm font-medium text-cream-50">
        {label}
        {required && <span className="text-gold-500"> *</span>}
      </label>
      {children}
      {hint && !hasError && <p className="text-xs text-muted-400">{hint}</p>}
      {hasError && (
        <p id={fieldErrorId(name)} className="text-xs text-danger-500" role="alert">
          {error!.join(" ")}
        </p>
      )}
    </div>
  );
}
