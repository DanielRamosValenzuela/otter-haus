import { Badge } from "@/components/ui/badge";
import type { PropertyStatus } from "@/lib/types/property";

const STATUS_TONE: Record<PropertyStatus, "success" | "warning" | "neutral"> = {
  disponible: "success",
  reservada: "warning",
  cerrada: "neutral",
};

const STATUS_LABEL: Record<PropertyStatus, string> = {
  disponible: "Disponible",
  reservada: "Reservada",
  cerrada: "Cerrada",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}
