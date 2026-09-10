"use client";

import type { ComponentProps, ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Drawer = RadixDialog.Root;
export const DrawerTrigger = RadixDialog.Trigger;
export const DrawerClose = RadixDialog.Close;

export function DrawerContent({
  className,
  children,
  title,
  ...props
}: ComponentProps<typeof RadixDialog.Content> & { title: string }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="drawer-overlay fixed inset-0 z-50 bg-scrim/80 backdrop-blur-sm" />
      <RadixDialog.Content
        className={cn(
          "drawer-content fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col",
          "bg-ink-900 border-l border-cream-50/10 outline-none",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-cream-50/10 px-5 py-4">
          <RadixDialog.Title className="font-display text-lg font-semibold">
            {title}
          </RadixDialog.Title>
          <RadixDialog.Close
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-muted-400 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="size-5" aria-hidden />
          </RadixDialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DrawerDescription({ children }: { children: ReactNode }) {
  return <RadixDialog.Description asChild>{children}</RadixDialog.Description>;
}
