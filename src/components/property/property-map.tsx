import type { PropertyLocation } from "@/lib/types/property";

export function PropertyMap({ location }: { location: PropertyLocation }) {
  const hasExactPin = location.mapsLat != null && location.mapsLng != null;

  const query = [location.addressHint, location.commune, location.city, "Chile"]
    .filter(Boolean)
    .join(", ");

  const src = hasExactPin
    ? `https://www.google.com/maps?q=${location.mapsLat},${location.mapsLng}&z=16&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">
        {hasExactPin ? "Ubicación" : "Ubicación aproximada"}
      </h2>
      <p className="mt-1 text-sm text-muted-400">
        {hasExactPin
          ? "Referencial — la dirección con número se comparte al agendar una visita."
          : "Referencial — la dirección exacta se comparte al agendar una visita."}
      </p>
      <div className="mt-3 overflow-hidden rounded-card border border-cream-50/10">
        <iframe
          src={src}
          className="h-80 w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Ubicación de ${location.commune}, ${location.zone}`}
        />
      </div>
      {location.mapsUrl && (
        <a
          href={location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-gold-400 hover:text-gold-500"
        >
          Abrir en Google Maps ↗
        </a>
      )}
    </div>
  );
}
