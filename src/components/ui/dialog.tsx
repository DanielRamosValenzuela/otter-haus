"use client";

import type { ComponentProps, ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  showClose = true,
  ...props
}: ComponentProps<typeof RadixDialog.Content> & {
  title: string;
  description?: string;
  showClose?: boolean;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-scrim/80 backdrop-blur-sm" />
      <RadixDialog.Content
        className={cn(
          "dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "glass rounded-card p-6 shadow-lift outline-none",
          className,
        )}
        {...props}
      >
        <RadixDialog.Title className="font-display text-xl font-semibold">
          {title}
        </RadixDialog.Title>
        {description && (
          <RadixDialog.Description className="mt-1 text-sm text-muted-400">
            {description}
          </RadixDialog.Description>
        )}
        <div className="mt-4">{children}</div>
        {showClose && (
          <RadixDialog.Close
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full p-1.5 text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="size-4" aria-hidden />
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
