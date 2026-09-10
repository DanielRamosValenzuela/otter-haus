import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { getAgent } from "@/lib/data/agent";
import { StatRow } from "@/components/marketing/stat-row";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
  YouTubeIcon,
  TikTokIcon,
} from "@/components/icons/social-icons";
import type { SocialPlatform } from "@/lib/types/agent";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce a la corredora detrás de TranHaus.",
};

const SOCIAL_ICON: Record<SocialPlatform, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
};

const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

async function AgentProfile() {
  const agent = await getAgent();

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
      <Reveal>
        <div className="relative aspect-[4/5] overflow-hidden rounded-card">
          <Image src={agent.photoUrl} alt={agent.name} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" priority />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-semibold">{agent.name}</h1>
          <p className="mt-1 text-gold-400">{agent.role}</p>
        </div>

        <StatRow stats={agent.stats} />

        <div className="space-y-4 whitespace-pre-line text-cream-50/90">{agent.bio}</div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-400">
            Credenciales
          </h2>
          <ul className="mt-3 space-y-2">
            {agent.credentials.map((credential) => (
              <li key={credential} className="flex items-start gap-2 text-sm">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
                {credential}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-400">
            Zonas de cobertura
          </h2>
          <p className="mt-2 text-sm text-cream-50/90">{agent.coverageZones.join(" · ")}</p>
        </div>

        {agent.socials.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {agent.socials.map((social) => {
              const Icon = SOCIAL_ICON[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABEL[social.platform] ?? social.platform}
                  className="flex size-11 items-center justify-center rounded-full border border-cream-50/15 text-cream-50 transition-colors hover:border-gold-500/50 hover:text-gold-400"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        )}
      </Reveal>
    </div>
  );
}

export default function NosotrosPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <Skeleton className="aspect-[4/5]" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          }
        >
          <AgentProfile />
        </Suspense>
      </div>
    </PageTransition>
  );
}
