import "server-only";
import { neon } from "@neondatabase/serverless";

import propertiesSeed from "@/data/properties.seed.json";
import agentSeed from "@/data/agent.seed.json";
import zonesSeed from "@/data/zones.seed.json";
import leadsSeed from "@/data/leads.seed.json";
import newsSeed from "@/data/news.seed.json";
import homeContentSeed from "@/data/home-content.seed.json";
import { env } from "@/lib/env";
import type { Property } from "@/lib/types/property";
import type { Agent } from "@/lib/types/agent";
import type { ZoneInput } from "@/lib/types/zone";
import type { Lead } from "@/lib/types/lead";
import type { NewsArticle } from "@/lib/types/news";
import type { HomeContent } from "@/lib/types/home-content";
import type { AdminAccount } from "@/lib/types/admin";

export interface Db {
  properties: Property[];
  agent: Agent;
  zones: ZoneInput[];
  leads: Lead[];
  news: NewsArticle[];
  homeContent: HomeContent;
  // null solo puede ocurrir en una base de datos recién creada, antes de
  // correr `npm run create-admin` — ver src/lib/data/admin.ts.
  admin: AdminAccount | null;
}

const sql = neon(env.DATABASE_URL);

function seedDb(): Db {
  return {
    properties: propertiesSeed as Property[],
    agent: agentSeed as Agent,
    zones: zonesSeed as ZoneInput[],
    leads: leadsSeed as Lead[],
    news: newsSeed as NewsArticle[],
    homeContent: homeContentSeed as HomeContent,
    admin: null,
  };
}

function withDefaults(db: Db): Db {
  let next = db;
  if (!next.news) next = { ...next, news: seedDb().news };
  if (!next.homeContent) next = { ...next, homeContent: seedDb().homeContent };
  return next;
}

let ensureTablePromise: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!ensureTablePromise) {
    ensureTablePromise = sql`
      CREATE TABLE IF NOT EXISTS app_state (
        id INT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  return ensureTablePromise;
}

async function readRow(): Promise<Db | null> {
  await ensureTable();
  const rows = await sql`SELECT data FROM app_state WHERE id = 1`;
  if (rows.length === 0) return null;
  return rows[0].data as Db;
}

async function writeRow(db: Db): Promise<void> {
  await ensureTable();
  await sql`
    INSERT INTO app_state (id, data, updated_at)
    VALUES (1, ${JSON.stringify(db)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `;
}

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function readDb(): Promise<Db> {
  return enqueue(async () => {
    const existing = await readRow();
    if (existing) {
      const migrated = withDefaults(existing);
      if (migrated !== existing) await writeRow(migrated);
      return migrated;
    }
    const seeded = seedDb();
    await writeRow(seeded);
    return seeded;
  });
}

export async function writeDb(mutate: (db: Db) => Db | Promise<Db>): Promise<Db> {
  return enqueue(async () => {
    const current = withDefaults((await readRow()) ?? seedDb());
    const next = await mutate(current);
    await writeRow(next);
    return next;
  });
}
