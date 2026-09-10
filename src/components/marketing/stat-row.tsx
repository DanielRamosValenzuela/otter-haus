import type { AgentStat } from "@/lib/types/agent";

export function StatRow({ stats }: { stats: AgentStat[] }) {
  return (
    <dl className="grid grid-cols-3 gap-4 sm:gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center sm:text-left">
          <dt className="text-xs uppercase tracking-wide text-muted-400">{stat.label}</dt>
          <dd className="font-sans text-3xl font-bold tabular-nums text-gold-400">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
