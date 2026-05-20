import { I18nManager } from "react-native";

import type { AppLocale } from "./locale";

/** Hebrew = RTL; English = LTR. */
export function localeWantsRtl(locale: AppLocale): boolean {
  return locale === "he";
}

/**
 * Returns true when a full app reload is required to apply direction.
 * Only calls forceRTL when native direction differs from locale — never when already aligned.
 */
export function needsRtlReload(locale: AppLocale): boolean {
  return I18nManager.isRTL !== localeWantsRtl(locale);
}

/**
 * Apply RTL/LTR for the given locale. Call only when {@link needsRtlReload} is true.
 * Reload must follow so native layout picks up the change (single reload per transition).
 */
export function applyRtlDirection(locale: AppLocale): void {
  const wantsRtl = localeWantsRtl(locale);
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(wantsRtl);
}
