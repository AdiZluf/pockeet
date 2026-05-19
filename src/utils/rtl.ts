import { I18nManager } from "react-native";

import { isRtlLocale } from "@/i18n";

/** Use for layout decisions when not using NativeWind logical utilities. */
export function useIsRtl() {
  return I18nManager.isRTL || isRtlLocale();
}

/** Money and charts stay LTR per docs. */
export const moneyTextProps = {
  writingDirection: "ltr" as const,
  style: { writingDirection: "ltr" as const },
};
