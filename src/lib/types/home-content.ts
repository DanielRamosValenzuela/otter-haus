export const VALUE_PROP_ICONS = [
  "handshake",
  "shield-check",
  "sparkles",
  "home",
  "key",
  "scale",
  "users",
  "heart",
  "award",
  "map-pin",
] as const;
export type ValuePropIcon = (typeof VALUE_PROP_ICONS)[number];

export interface ValuePropItem {
  id: string;
  icon: ValuePropIcon;
  title: string;
  description: string;
}

export type ValuePropInput = Omit<ValuePropItem, "id"> & { id?: string };

export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    mobileImageUrl: string;
    mobileImageAlt: string;
  };
  zoneSection: {
    visible: boolean;
    eyebrow: string;
    title: string;
    description: string;
  };
  featuredSection: {
    visible: boolean;
    eyebrow: string;
    title: string;
    description: string;
  };
  valueSection: {
    visible: boolean;
    eyebrow: string;
    title: string;
    items: ValuePropItem[];
  };
  teamSection: {
    visible: boolean;
    singleEyebrow: string;
    singleCtaLabel: string;
    teamEyebrow: string;
    teamTitle: string;
    teamCtaLabel: string;
  };
  footerDescription: string;
  updatedAt: string;
}

export type HomeContentInput = Omit<HomeContent, "updatedAt" | "valueSection"> & {
  valueSection: Omit<HomeContent["valueSection"], "items"> & { items: ValuePropInput[] };
};
