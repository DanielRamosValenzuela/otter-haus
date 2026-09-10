const DEFAULT_SITE_URL = "http://localhost:3000";

// `new URL(SITE.url)` runs at module load (see app/layout.tsx metadata),
// so this must never throw — Vercel env vars are easy to leave empty or
// set without a protocol (e.g. "my-app.vercel.app"), and either one
// would otherwise crash the whole build with "Invalid URL".
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    try {
      return new URL(`https://${raw}`).origin;
    } catch {
      return DEFAULT_SITE_URL;
    }
  }
}

export const SITE = {
  name: "TranHaus",
  tagline: "Tu próximo capítulo comienza aquí.",
  description:
    "Corretaje de propiedades de lujo en Chile — venta y arriendo con asesoría de alto nivel.",
  url: resolveSiteUrl(),
  locale: "es-CL",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/guia-legal", label: "Guía Legal" },
  { href: "/nosotros", label: "Nosotros" },
] as const;

export const CTA_LINK = { href: "/contacto", label: "Contacto" } as const;

// Placeholder de contacto — dato ficticio, ver docs/02-negocio.md
// (pregunta abierta #4: reemplazar por datos reales del corredor).
export const CONTACT = {
  whatsapp: "56912345678", // E.164 sin "+", para wa.me
  phoneDisplay: "+56 9 1234 5678",
  email: "contacto@tranhaus.cl",
} as const;
