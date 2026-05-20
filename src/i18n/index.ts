import i18n from "i18next";
import { I18nManager } from "react-native";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

/** Lock native layout to LTR for English-only MVP. */
function ensureLtrLayout() {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

ensureLtrLayout();

const i18nReady = !i18n.isInitialized
  ? i18n.use(initReactI18next).init({
      compatibilityJSON: "v4",
      resources: { en: { translation: en } },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    })
  : Promise.resolve();

/**
 * Ensures i18n + react-i18next are ready before screens use useTranslation.
 */
export async function initI18n(): Promise<void> {
  await i18nReady;
}

export default i18n;
