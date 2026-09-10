import { formatPrice } from "@/lib/utils/format";
import type { PropertyPrice } from "@/lib/types/property";
import { cn } from "@/lib/utils/cn";

export function Price({ price, className }: { price: PropertyPrice; className?: string }) {
  return (
    <span className={cn("font-sans text-2xl font-bold tabular-nums text-gold-400", className)}>
      {formatPrice(price)}
      {price.currency === "CLP" && (
        <span className="ml-1 text-sm font-normal text-muted-400">/mes</span>
      )}
    </span>
  );
}
