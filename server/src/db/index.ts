import { Database } from "bun:sqlite";
import { join } from "path";

const DB_PATH = join(import.meta.dir, "../../data/directory.db");

// Ensure data directory exists
import { mkdirSync } from "fs";
mkdirSync(join(import.meta.dir, "../../data"), { recursive: true });

export const db = new Database(DB_PATH, { create: true });

// Enable WAL mode for better performance
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT DEFAULT '📁',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      location TEXT,
      description TEXT,
      tags TEXT DEFAULT '[]',
      phone TEXT,
      email TEXT,
      website TEXT,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
    CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
  `);
}

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  created_at: string;
  listing_count?: number;
};

export type Listing = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  location: string | null;
  description: string | null;
  tags: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
};
