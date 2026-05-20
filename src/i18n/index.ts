import i18n from "i18next";
import { I18nManager } from "react-native";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

let initPromise: Promise<void> | null = null;

/** Lock native layout to LTR for English-only MVP. */
function ensureLtrLayout() {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

/**
 * Initialize English copy once at app start.
 * Hebrew / RTL deferred to v1.1+.
 */
export async function initI18n(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    ensureLtrLayout();

    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        compatibilityJSON: "v4",
        resources: { en: { translation: en } },
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
      });
    }
  })();

  return initPromise;
}

export default i18n;
