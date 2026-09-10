import Link from "next/link";
import Image from "next/image";
import type { Agent } from "@/lib/types/agent";
import { Button } from "@/components/ui/button";

export function NewsAgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="scrim-scope space-y-5 rounded-card border border-cream-50/10 bg-ink-900 p-6 text-cream-50">
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-gold-500/30">
          <Image src={agent.photoUrl} alt={agent.name} fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold">{agent.name}</p>
          <p className="text-xs leading-snug text-muted-400">{agent.role}</p>
        </div>
      </div>

      <p className="text-sm text-muted-400">{agent.shortBio}</p>

      <dl className="grid grid-cols-3 gap-2 border-y border-cream-50/10 py-4 text-center">
        {agent.stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-sans text-lg font-bold tabular-nums text-gold-400">{stat.value}</dd>
            <dt className="text-[10px] uppercase tracking-wide text-muted-400">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <Button as={Link} href="/nosotros" variant="outline" className="w-full justify-center">
        Conoce más sobre {agent.name.split(" ")[0]}
      </Button>
    </div>
  );
}
