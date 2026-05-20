import { eq } from "drizzle-orm";

import { db } from "../client";
import { appPreferences } from "../schema";

export const PREFERENCE_DEFAULT_CURRENCY = "default_currency";
export const SUPPORTED_DISPLAY_CURRENCIES = ["ILS", "USD", "EUR"] as const;
export type DisplayCurrency = (typeof SUPPORTED_DISPLAY_CURRENCIES)[number];

const DEFAULT_CURRENCY: DisplayCurrency = "ILS";

export async function getDefaultCurrency(): Promise<DisplayCurrency> {
  const row = await db.query.appPreferences.findFirst({
    where: eq(appPreferences.key, PREFERENCE_DEFAULT_CURRENCY),
  });
  const value = row?.value;
  if (value && SUPPORTED_DISPLAY_CURRENCIES.includes(value as DisplayCurrency)) {
    return value as DisplayCurrency;
  }
  return DEFAULT_CURRENCY;
}

export async function setDefaultCurrency(code: DisplayCurrency) {
  await db
    .insert(appPreferences)
    .values({ key: PREFERENCE_DEFAULT_CURRENCY, value: code })
    .onConflictDoUpdate({
      target: appPreferences.key,
      set: { value: code },
    });
}
