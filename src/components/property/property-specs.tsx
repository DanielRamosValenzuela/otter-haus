import { Bed, Bath, Car, Ruler, Trees, Check } from "lucide-react";
import type { Property } from "@/lib/types/property";
import { formatArea } from "@/lib/utils/format";

export function PropertySpecs({ property }: { property: Property }) {
  const { features } = property;
  const items = [
    features.bedrooms > 0 && { icon: Bed, label: "Dormitorios", value: features.bedrooms },
    features.bathrooms > 0 && { icon: Bath, label: "Baños", value: features.bathrooms },
    features.parkingSpaces > 0 && { icon: Car, label: "Estacionamientos", value: features.parkingSpaces },
    features.builtAreaM2 > 0 && { icon: Ruler, label: "Superficie construida", value: formatArea(features.builtAreaM2) },
    features.landAreaM2 && { icon: Trees, label: "Superficie de terreno", value: formatArea(features.landAreaM2) },
  ].filter(Boolean) as { icon: typeof Bed; label: string; value: string | number }[];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border border-cream-50/10 bg-ink-900/50 p-4">
            <Icon className="size-5 text-gold-500" aria-hidden />
            <p className="mt-2 text-lg font-semibold">{value}</p>
            <p className="text-xs text-muted-400">{label}</p>
          </div>
        ))}
      </div>

      {features.amenities.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold">Características</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {features.amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-2 text-sm text-cream-50/90">
                <Check className="size-4 text-gold-500" aria-hidden />
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
