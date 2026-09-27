import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function ViewPageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden />
    </Link>
  );
}
