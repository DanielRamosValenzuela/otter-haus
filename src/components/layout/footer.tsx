import Link from "next/link";
import { cacheLife } from "next/cache";
import { NAV_LINKS, CONTACT, SITE } from "@/lib/content/site";

// A plain `new Date()` read here is a non-deterministic value during
// prerendering (Cache Components flags it) — the copyright year only
// needs to be right once a year, so it's cached instead of made dynamic.
async function CopyrightYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

export function Footer() {
  return (
    // `relative` isn't for layout here — it puts the footer in the
    // "positioned, z-index:auto" paint bucket alongside the home page's
    // fixed cinematic background, so DOM order (footer comes after)
    // decides the stack instead of the footer (being `static`) always
    // painting *below* any positioned element per CSS stacking rules.
    <footer className="relative border-t border-cream-50/10 bg-ink-900/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <span className="font-display text-xl font-semibold">
              TRAN<span className="text-gold-500">HAUS</span>
            </span>
            <p className="max-w-xs text-sm text-muted-400">{SITE.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-400">
              Navegación
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-50/90 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-400">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-cream-50/90">
              <li>{CONTACT.phoneDisplay}</li>
              <li>{CONTACT.email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cream-50/10 pt-6 text-xs text-muted-500">
          © <CopyrightYear /> {SITE.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
