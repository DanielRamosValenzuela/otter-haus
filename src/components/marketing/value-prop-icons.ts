import {
  Award,
  Handshake,
  Heart,
  Home,
  Key,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ValuePropIcon } from "@/lib/types/home-content";

export const VALUE_PROP_ICON_MAP: Record<ValuePropIcon, LucideIcon> = {
  handshake: Handshake,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  home: Home,
  key: Key,
  scale: Scale,
  users: Users,
  heart: Heart,
  award: Award,
  "map-pin": MapPin,
};

export const VALUE_PROP_ICON_LABELS: Record<ValuePropIcon, string> = {
  handshake: "Apretón de manos",
  "shield-check": "Escudo",
  sparkles: "Destellos",
  home: "Casa",
  key: "Llave",
  scale: "Balanza",
  users: "Personas",
  heart: "Corazón",
  award: "Premio",
  "map-pin": "Ubicación",
};
