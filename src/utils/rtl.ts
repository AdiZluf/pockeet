import { I18nManager } from "react-native";
import type { Ionicons } from "@expo/vector-icons";

import { isRtlLocale } from "@/i18n";

/** Use for layout decisions when not using NativeWind logical utilities. */
export function useIsRtl() {
  return I18nManager.isRTL || isRtlLocale();
}

/** Back navigation chevron — mirrors with layout direction. */
export function getBackChevronIcon(): keyof typeof Ionicons.glyphMap {
  return I18nManager.isRTL ? "chevron-forward" : "chevron-back";
}

/** Money and charts stay LTR per docs. */
export const moneyTextProps = {
  writingDirection: "ltr" as const,
  style: { writingDirection: "ltr" as const },
};
