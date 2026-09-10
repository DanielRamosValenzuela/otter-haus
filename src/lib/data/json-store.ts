import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import propertiesSeed from "@/data/properties.seed.json";
import agentSeed from "@/data/agent.seed.json";
import zonesSeed from "@/data/zones.seed.json";
import leadsSeed from "@/data/leads.seed.json";
import type { Property } from "@/lib/types/property";
import type { Agent } from "@/lib/types/agent";
import type { ZoneInput } from "@/lib/types/zone";
import type { Lead } from "@/lib/types/lead";

// The ONLY module in the app that knows the data lives in a JSON file.
// See docs/04-tecnico.md: this is dev/demo-grade persistence by design —
// swapping it for a real database later is a change confined to this
// directory, not to pages/components/Server Actions.
export interface Db {
  properties: Property[];
  agent: Agent;
  zones: ZoneInput[];
  leads: Lead[];
}

function resolveDataDir(): string {
  if (process.env.TRANHAUS_DATA_DIR) return process.env.TRANHAUS_DATA_DIR;
  if (process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "tranhaus-data");
  }
  return path.join(process.cwd(), ".data");
}

const DATA_DIR = resolveDataDir();
const DB_PATH = path.join(DATA_DIR, "db.json");

function seedDb(): Db {
  return {
    properties: propertiesSeed as Property[],
    agent: agentSeed as Agent,
    zones: zonesSeed as ZoneInput[],
    leads: leadsSeed as Lead[],
  };
}

async function readDbFile(): Promise<Db | null> {
  try {
    const raw = await readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Db;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return null;
  }
}

async function writeDbFile(db: Db): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  // Unique per call (not just per-process) — several cached reads can race
  // to seed the store concurrently within the same process/pid, and a
  // shared tmp name meant the first rename() could steal the file out from
  // under the second, throwing ENOENT.
  const tmpPath = `${DB_PATH}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await writeFile(tmpPath, JSON.stringify(db, null, 2), "utf-8");
  await rename(tmpPath, DB_PATH);
}

// Serializes every read-that-might-seed and every write through one queue,
// so concurrent callers (several "use cache" reads hitting an empty store
// at once, or two Server Actions racing) can't interleave file operations.
// A real database would use transactions instead — this is the JSON-mock
// equivalent, and is one of the things a DB migration removes entirely.
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn);
  // Never let a failed run poison the queue for subsequent callers.
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/**
 * Reads the current store, seeding it on first access. Must be called
 * from inside the "use cache" function that needs it — never imported or
 * read at module scope, or mutations made after the process starts would
 * never be observed (see docs/04-tecnico.md / Next.js Cache Components
 * "predictable values").
 */
export async function readDb(): Promise<Db> {
  return enqueue(async () => {
    const existing = await readDbFile();
    if (existing) return existing;
    const seeded = seedDb();
    await writeDbFile(seeded);
    return seeded;
  });
}

/**
 * Reads, applies `mutate`, and persists the result — atomically with
 * respect to every other call to `readDb`/`writeDb` in this process.
 */
export async function writeDb(mutate: (db: Db) => Db | Promise<Db>): Promise<Db> {
  return enqueue(async () => {
    const current = (await readDbFile()) ?? seedDb();
    const next = await mutate(current);
    await writeDbFile(next);
    return next;
  });
}
