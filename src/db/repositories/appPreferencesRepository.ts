import { eq } from "drizzle-orm";

import { db } from "../client";
import { appPreferences } from "../schema";

export async function getAppPreference(key: string): Promise<string | null> {
  const row = await db.query.appPreferences.findFirst({
    where: eq(appPreferences.key, key),
    columns: { value: true },
  });
  return row?.value ?? null;
}

export async function setAppPreference(key: string, value: string): Promise<void> {
  await db
    .insert(appPreferences)
    .values({ key, value })
    .onConflictDoUpdate({
      target: appPreferences.key,
      set: { value },
    });
}

export async function deleteAppPreference(key: string): Promise<void> {
  await db.delete(appPreferences).where(eq(appPreferences.key, key));
}
