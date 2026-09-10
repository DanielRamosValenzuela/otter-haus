export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  zoneSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  featuredSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  updatedAt: string;
}

export type HomeContentInput = Omit<HomeContent, "updatedAt">;
