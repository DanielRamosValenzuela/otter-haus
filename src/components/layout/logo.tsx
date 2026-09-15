import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const ICON_SIZES = {
  sm: "h-9",
  md: "h-12",
  lg: "h-20",
} as const;

const TEXT_SIZES = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
} as const;

export function Logo({
  size = "sm",
  priority,
  className,
}: {
  size?: keyof typeof ICON_SIZES;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/image/logo-icon.png"
        alt=""
        width={1473}
        height={951}
        priority={priority}
        className={cn(ICON_SIZES[size], "w-auto shrink-0 object-contain")}
      />
      <span className={cn("font-display font-semibold tracking-tight", TEXT_SIZES[size])}>
        Otter<span className="text-gold-500">Haus</span>
      </span>
    </span>
  );
}
