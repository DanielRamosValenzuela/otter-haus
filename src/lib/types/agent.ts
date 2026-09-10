export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "tiktok",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface AgentStat {
  label: string;
  value: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  /** Long bio, paragraphs separated by "\n\n". */
  bio: string;
  /** Short teaser shown on Home. */
  shortBio: string;
  email: string;
  phone: string;
  /** Digits only, E.164, used to build wa.me links. */
  whatsapp: string;
  coverageZones: string[];
  credentials: string[];
  stats: AgentStat[];
  socials: SocialLink[];
  updatedAt: string;
}

export type AgentInput = Omit<Agent, "id" | "updatedAt">;
