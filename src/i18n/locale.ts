import { getLocales } from "expo-localization";

export const supportedLocales = ["en", "he"] as const;
export type AppLocale = (typeof supportedLocales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return value === "en" || value === "he";
}

export function getDeviceLocale(): AppLocale {
  const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
  return deviceLanguage === "he" ? "he" : "en";
}
