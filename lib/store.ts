// Server-only SQLite store for sweets. One table, keyed by an unguessable id. No listing endpoint.
import 'server-only';
import Database from 'better-sqlite3';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Sweet, SweetData } from './sweet';

export const DATA_DIR = path.resolve(process.env.SWEET_DATA_DIR || './data');

let db: Database.Database | null = null;
function conn() {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(path.join(DATA_DIR, 'sweets.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS sweets (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);
  return db;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
/** 12 base62 characters from a CSPRNG (~71 bits), e.g. k3Fq9xT2mBa7. */
export function newId(len = 12) {
  const out: string[] = [];
  while (out.length < len) {
    for (const b of randomBytes(len * 2)) {
      if (b < 248 && out.length < len) out.push(ALPHABET[b % 62]); // 248 = 62*4, avoids modulo bias
    }
  }
  return out.join('');
}

export const ID_RE = /^[A-Za-z0-9]{8,32}$/;

export function createSweet(input: SweetData, id = newId()): Sweet {
  const sweet: Sweet = { id, createdAt: new Date().toISOString(), ...input };
  const { id: _id, createdAt, ...data } = sweet;
  conn().prepare('INSERT INTO sweets (id, data, created_at) VALUES (?, ?, ?)').run(id, JSON.stringify(data), createdAt);
  return sweet;
}

export function getSweet(id: string): Sweet | null {
  if (!ID_RE.test(id)) return null;
  const row = conn().prepare('SELECT id, data, created_at FROM sweets WHERE id = ?').get(id) as
    | { id: string; data: string; created_at: string } | undefined;
  if (!row) return null;
  return { id: row.id, createdAt: row.created_at, ...(JSON.parse(row.data) as SweetData) };
}
