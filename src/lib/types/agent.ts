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
  bio: string;
  shortBio: string;
  email: string;
  phone: string;
  whatsapp: string;
  coverageZones: string[];
  credentials: string[];
  stats: AgentStat[];
  socials: SocialLink[];
  updatedAt: string;
}

export type AgentInput = Omit<Agent, "id" | "updatedAt">;
