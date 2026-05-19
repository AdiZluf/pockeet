import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "./schema";

const DB_NAME = "pockeet.db";

export const expoDb = openDatabaseSync(DB_NAME, {
  enableChangeListener: true,
});

export const db = drizzle(expoDb, { schema });

export type Database = typeof db;
