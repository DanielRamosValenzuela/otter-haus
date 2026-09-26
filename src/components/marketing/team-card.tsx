import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import type { AccountProfile } from "@/lib/types/admin";

export function TeamCard({ member }: { member: AccountProfile }) {
  return (
    <Link
      href={`/equipo/${member.slug}`}
      className="group block overflow-hidden rounded-card border border-cream-50/10 bg-ink-900 p-6 text-center transition-[transform,box-shadow] duration-300 ease-lux hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full border border-gold-500/30 bg-ink-800">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 ease-lux group-hover:scale-105"
          />
        ) : (
          <User className="size-8 text-muted-400" aria-hidden />
        )}
      </div>
      <p className="mt-4 font-display text-lg font-semibold text-cream-50">{member.name}</p>
      {member.roleTitle && <p className="text-sm text-gold-400">{member.roleTitle}</p>}
    </Link>
  );
}
