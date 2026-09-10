import Link from "next/link";
import Image from "next/image";
import { getAgent } from "@/lib/data/agent";
import { StatRow } from "@/components/marketing/stat-row";
import { Button } from "@/components/ui/button";

export async function AgentTeaser() {
  const agent = await getAgent();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card sm:aspect-[16/10] lg:aspect-[4/5]">
          <Image
            src={agent.photoUrl}
            alt={agent.name}
            fill
            sizes="(min-width: 1024px) 480px, 90vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Tu corredora
          </span>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{agent.name}</h2>
          <p className="text-muted-400">{agent.shortBio}</p>
          <StatRow stats={agent.stats} />
          <Button as={Link} href="/nosotros" variant="outline">
            Conoce más sobre {agent.name.split(" ")[0]}
          </Button>
        </div>
      </div>
    </section>
  );
}
