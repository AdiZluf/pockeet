import { db, expoDb } from "./client";
import { categorySeeds } from "./seed/categories";
import { categories } from "./schema";

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_he TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'local',
    status TEXT NOT NULL,
    merchant_name TEXT,
    purchased_at TEXT,
    currency_code TEXT NOT NULL DEFAULT 'ILS',
    subtotal_minor INTEGER,
    tax_minor INTEGER,
    total_minor INTEGER,
    default_category_id TEXT REFERENCES categories(id),
    confidence INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT
  );`,
  `CREATE INDEX IF NOT EXISTS receipts_user_id_idx ON receipts(user_id);`,
  `CREATE INDEX IF NOT EXISTS receipts_status_idx ON receipts(status);`,
  `CREATE INDEX IF NOT EXISTS receipts_purchased_at_idx ON receipts(purchased_at);`,
  `CREATE TABLE IF NOT EXISTS receipt_images (
    id TEXT PRIMARY KEY NOT NULL,
    receipt_id TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    local_uri TEXT NOT NULL,
    remote_url TEXT,
    upload_status TEXT NOT NULL DEFAULT 'pending',
    width INTEGER,
    height INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  `CREATE INDEX IF NOT EXISTS receipt_images_receipt_id_idx ON receipt_images(receipt_id);`,
  `CREATE TABLE IF NOT EXISTS line_items (
    id TEXT PRIMARY KEY NOT NULL,
    receipt_id TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER,
    unit_price_minor INTEGER,
    total_minor INTEGER NOT NULL,
    category_id TEXT REFERENCES categories(id),
    confidence INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  `CREATE INDEX IF NOT EXISTS line_items_receipt_id_idx ON line_items(receipt_id);`,
  `CREATE TABLE IF NOT EXISTS sync_outbox (
    id TEXT PRIMARY KEY NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    op TEXT NOT NULL,
    payload TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
];

let migrated = false;

export async function migrateDatabase() {
  if (migrated) return;

  for (const statement of SCHEMA_STATEMENTS) {
    expoDb.execSync(statement);
  }

  for (const seed of categorySeeds) {
    await db.insert(categories).values(seed).onConflictDoNothing();
  }

  migrated = true;
}
