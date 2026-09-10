import { ShieldCheck, Handshake, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";

const VALUE_PROPS = [
  {
    icon: Handshake,
    title: "Asesoría personalizada",
    description:
      "Acompañamiento cercano en cada etapa, desde la primera visita hasta la firma final.",
  },
  {
    icon: ShieldCheck,
    title: "Transparencia total",
    description:
      "Información clara sobre precios, estado legal y condiciones — sin sorpresas de último minuto.",
  },
  {
    icon: Sparkles,
    title: "Propiedades exclusivas",
    description:
      "Un catálogo curado en las mejores zonas de Santiago, seleccionado con criterio de calidad.",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Por qué TranHaus"
        title="Una experiencia inmobiliaria distinta"
        align="center"
        className="mx-auto"
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="p-6 transition-transform duration-300 ease-lux hover:-translate-y-1">
            <Icon className="size-8 text-gold-500" aria-hidden />
            <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-400">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
