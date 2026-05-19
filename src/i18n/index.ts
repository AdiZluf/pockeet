import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import en from "./locales/en.json";
import he from "./locales/he.json";

export const supportedLocales = ["en", "he"] as const;
export type AppLocale = (typeof supportedLocales)[number];

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
const initialLocale: AppLocale = deviceLanguage === "he" ? "he" : "en";

function applyRtl(locale: AppLocale) {
  const isRtl = locale === "he";
  if (I18nManager.isRTL !== isRtl) {
    I18nManager.allowRTL(isRtl);
    I18nManager.forceRTL(isRtl);
    // RTL changes require reload in RN — documented for settings flow later.
  }
}

applyRtl(initialLocale);

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: initialLocale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setAppLocale(locale: AppLocale) {
  applyRtl(locale);
  void i18n.changeLanguage(locale);
}

export function isRtlLocale(locale?: string) {
  return (locale ?? i18n.language) === "he";
}

export default i18n;
