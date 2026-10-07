import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { getAgent } from "@/lib/data/agent";
import { listFeaturedTeamMembers } from "@/lib/data/admin";
import { StatRow } from "@/components/marketing/stat-row";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { cn } from "@/lib/utils/cn";

function PersonCard({
  href,
  name,
  role,
  photoUrl,
}: {
  href: string;
  name: string;
  role?: string | null;
  photoUrl?: string | null;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-card bg-ink-800 shadow-lift">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 320px, 45vw"
            className="object-cover object-top transition-transform duration-500 ease-lux group-hover:scale-105"
          />
        ) : (
          <User className="size-12 text-muted-500" aria-hidden />
        )}
      </div>
      <p className="mt-3 font-display text-lg font-semibold text-cream-50">{name}</p>
      {role && <p className="text-sm text-gold-400">{role}</p>}
    </Link>
  );
}

export async function AgentTeaser() {
  const [agent, members] = await Promise.all([getAgent(), listFeaturedTeamMembers()]);

  if (members.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-lift">
              <Image
                src={agent.photoUrl}
                alt={agent.name}
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Tu corredora
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{agent.name}</h2>
            <p className="mt-3 text-muted-400">{agent.shortBio}</p>
            <div className="mt-5">
              <StatRow stats={agent.stats} />
            </div>
            <Button as={Link} href="/nosotros" variant="outline" className="mt-6">
              Conoce más sobre {agent.name.split(" ")[0]}
            </Button>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Tu equipo
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Conoce a quienes te acompañan
        </h2>
        <p className="mt-3 text-muted-400">{agent.shortBio}</p>
      </Reveal>

      <Stagger
        className={cn(
          "mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6",
          members.length >= 2 && "lg:grid-cols-3",
        )}
      >
        <StaggerItem>
          <PersonCard href="/nosotros" name={agent.name} role={agent.role} photoUrl={agent.photoUrl} />
        </StaggerItem>
        {members.map((member) => (
          <StaggerItem key={member.id}>
            <PersonCard
              href={`/equipo/${member.slug}`}
              name={member.name}
              role={member.roleTitle}
              photoUrl={member.photoUrl}
            />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-6">
        <StatRow stats={agent.stats} />
        <Button as={Link} href="/nosotros" variant="outline">
          Conoce más sobre nosotros
        </Button>
      </div>
    </section>
  );
}
