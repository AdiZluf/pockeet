import { expoDb } from "../client";
import { type AppLocale, isAppLocale } from "@/i18n/locale";

const LOCALE_KEY = "app_locale";
/** Set to 1 before RTL reload; cleared after bootstrap resumes post-reload. Prevents reload loops. */
const RTL_RELOAD_PENDING_KEY = "rtl_reload_pending";

const PREFERENCES_TABLE = `CREATE TABLE IF NOT EXISTS app_preferences (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);`;

let tableReady = false;

function ensureTable() {
  if (tableReady) return;
  expoDb.execSync(PREFERENCES_TABLE);
  tableReady = true;
}

export async function getPersistedLocale(): Promise<AppLocale | null> {
  ensureTable();
  const row = expoDb.getFirstSync<{ value: string }>(
    "SELECT value FROM app_preferences WHERE key = ?",
    LOCALE_KEY,
  );
  if (row?.value && isAppLocale(row.value)) return row.value;
  return null;
}

export async function persistLocale(locale: AppLocale): Promise<void> {
  ensureTable();
  expoDb.runSync(
    `INSERT INTO app_preferences (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    LOCALE_KEY,
    locale,
  );
}

export async function isRtlReloadPending(): Promise<boolean> {
  ensureTable();
  const row = expoDb.getFirstSync<{ value: string }>(
    "SELECT value FROM app_preferences WHERE key = ?",
    RTL_RELOAD_PENDING_KEY,
  );
  return row?.value === "1";
}

export async function setRtlReloadPending(pending: boolean): Promise<void> {
  ensureTable();
  if (pending) {
    expoDb.runSync(
      `INSERT INTO app_preferences (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      RTL_RELOAD_PENDING_KEY,
      "1",
    );
  } else {
    expoDb.runSync("DELETE FROM app_preferences WHERE key = ?", RTL_RELOAD_PENDING_KEY);
  }
}
