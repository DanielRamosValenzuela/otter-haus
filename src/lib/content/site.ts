export const SITE = {
  name: "TranHaus",
  tagline: "Tu próximo capítulo comienza aquí.",
  description:
    "Corretaje de propiedades de lujo en Chile — venta y arriendo con asesoría de alto nivel.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
