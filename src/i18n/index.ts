import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import {
  getPersistedLocale,
  isRtlReloadPending,
  persistLocale,
  setRtlReloadPending,
} from "@/db/repositories/localeRepository";
import { reloadApp } from "@/utils/reloadApp";

import en from "./locales/en.json";
import he from "./locales/he.json";
import { type AppLocale, getDeviceLocale } from "./locale";
import { applyRtlDirection, localeWantsRtl, needsRtlReload } from "./rtlSync";

export { supportedLocales, type AppLocale } from "./locale";
export { getDeviceLocale } from "./locale";
export { localeWantsRtl, needsRtlReload } from "./rtlSync";

let initPromise: Promise<boolean> | null = null;

async function ensureI18nInitialized(locale: AppLocale) {
  if (i18n.isInitialized) {
    if (i18n.language !== locale) {
      await i18n.changeLanguage(locale);
    }
    return;
  }

  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    lng: locale,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

/**
 * Cold start: load persisted locale, sync i18n, reload at most once when direction mismatches.
 *
 * Reload loop guard: before reload we set `rtl_reload_pending`. After reload, bootstrap sees
 * the flag and continues without a second reload even if I18nManager.isRTL still lags.
 */
export async function bootstrapI18n(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const persisted = await getPersistedLocale();
    const locale = persisted ?? getDeviceLocale();

    if (await isRtlReloadPending()) {
      // Post-reload resume: exactly one reload was already performed for this transition.
      await setRtlReloadPending(false);
      await ensureI18nInitialized(locale);
      return false;
    }

    if (!needsRtlReload(locale)) {
      await ensureI18nInitialized(locale);
      return false;
    }

    // Direction mismatch — persist, mark pending, apply RTL, reload once.
    await persistLocale(locale);
    await setRtlReloadPending(true);
    applyRtlDirection(locale);
    reloadApp();
    return true;
  })();

  return initPromise;
}

/**
 * User-initiated locale change. Persists first; reloads only when LTR ↔ RTL changes.
 */
export async function setAppLocale(locale: AppLocale): Promise<void> {
  const wantsRtl = localeWantsRtl(locale);

  if (i18n.isInitialized && i18n.language === locale && I18nManager.isRTL === wantsRtl) {
    return;
  }

  await persistLocale(locale);

  if (!needsRtlReload(locale)) {
    await ensureI18nInitialized(locale);
    return;
  }

  await setRtlReloadPending(true);
  applyRtlDirection(locale);
  reloadApp();
}

export function isRtlLocale(locale?: string) {
  return (locale ?? i18n.language) === "he";
}

export default i18n;
