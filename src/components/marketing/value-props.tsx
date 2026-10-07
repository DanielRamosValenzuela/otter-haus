import { getHomeContent } from "@/lib/data/home-content";
import { VALUE_PROP_ICON_MAP } from "@/components/marketing/value-prop-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";

export async function ValueProps() {
  const { valueSection } = await getHomeContent();
  if (!valueSection.visible) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={valueSection.eyebrow}
        title={valueSection.title}
        align="center"
        className="mx-auto"
      />

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {valueSection.items.map(({ id, icon, title, description }) => {
          const Icon = VALUE_PROP_ICON_MAP[icon];
          return (
            <Card key={id} className="w-full p-6 transition-transform duration-300 ease-lux hover:-translate-y-1 sm:w-[calc(33.333%-1rem)]">
              <Icon className="size-8 text-gold-500" aria-hidden />
              <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-400">{description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
