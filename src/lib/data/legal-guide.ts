import "server-only";
import { randomUUID } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";

import { sql } from "@/lib/data/db";
import { normalizeNewlines } from "@/components/ui/rich-text";
import type { LegalGuide, LegalGuideInput } from "@/lib/types/legal-guide";

interface SectionRow {
  id: string;
  title: string;
  body: string;
}

function bodyToItems(body: string): string[] {
  return normalizeNewlines(body)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export async function getLegalGuide(): Promise<LegalGuide> {
  "use cache";
  cacheTag("legal-guide");
  cacheLife("days");

  const [introRows, sectionRows] = await Promise.all([
    sql`SELECT intro FROM legal_guide WHERE id = 'main'`,
    sql`SELECT id, title, body FROM legal_guide_sections ORDER BY position`,
  ]);

  return {
    intro: (introRows[0]?.intro as string | undefined) ?? "",
    sections: (sectionRows as SectionRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      items: bodyToItems(row.body),
    })),
  };
}

export async function saveLegalGuide(input: LegalGuideInput): Promise<void> {
  await sql.transaction([
    sql`
      INSERT INTO legal_guide (id, intro) VALUES ('main', ${input.intro})
      ON CONFLICT (id) DO UPDATE SET intro = EXCLUDED.intro, updated_at = now()
    `,
    sql`DELETE FROM legal_guide_sections`,
    ...input.sections.map(
      (section, position) => sql`
        INSERT INTO legal_guide_sections (id, position, title, body)
        VALUES (${section.id ?? `sec-${randomUUID()}`}, ${position}, ${section.title}, ${section.body})
      `,
    ),
  ]);
}
