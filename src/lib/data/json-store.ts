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
  const tmpPath = `${DB_PATH}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await writeFile(tmpPath, JSON.stringify(db, null, 2), "utf-8");
  await rename(tmpPath, DB_PATH);
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
    const existing = await readDbFile();
    if (existing) return existing;
    const seeded = seedDb();
    await writeDbFile(seeded);
    return seeded;
  });
}

export async function writeDb(mutate: (db: Db) => Db | Promise<Db>): Promise<Db> {
  return enqueue(async () => {
    const current = (await readDbFile()) ?? seedDb();
    const next = await mutate(current);
    await writeDbFile(next);
    return next;
  });
}
