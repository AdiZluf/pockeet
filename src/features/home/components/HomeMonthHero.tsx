import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { DeltaChip, HeroSurface, Text } from "@/components/ui";
import { formatMoney, moneyWritingProps } from "@/utils/money";

type HomeMonthHeroProps = {
  totalMinor: number;
  currencyCode: string;
  hasParsedTotals: boolean;
  deltaMinor: number | null;
  otherCurrencyCount: number;
};

export function HomeMonthHero({
  totalMinor,
  currencyCode,
  hasParsedTotals,
  deltaMinor,
  otherCurrencyCount,
}: HomeMonthHeroProps) {
  const { t } = useTranslation();

  const deltaTone =
    deltaMinor == null ? null : deltaMinor === 0 ? "neutral" : deltaMinor > 0 ? "up" : "down";

  const deltaLabel =
    deltaMinor == null
      ? null
      : deltaMinor === 0
        ? t("home.deltaSame")
        : deltaMinor > 0
          ? t("home.deltaUp", { amount: formatMoney(deltaMinor, currencyCode) })
          : t("home.deltaDown", {
              amount: formatMoney(Math.abs(deltaMinor), currencyCode),
            });

  return (
    <View className="px-5 pb-4 pt-2" accessibilityRole="header">
      <HeroSurface>
        <View className="px-6 pb-8 pt-6">
          <Text variant="caption" align="start" className="text-white/90">
            {t("home.monthTotal")}
          </Text>
          <Text
            variant="displayHero"
            tabular
            align="start"
            className="mt-2 text-white"
            {...moneyWritingProps}
          >
            {hasParsedTotals
              ? formatMoney(totalMinor, currencyCode)
              : t("home.monthTotalPending")}
          </Text>
          {deltaLabel && deltaTone ? (
            <View className="mt-4">
              <DeltaChip label={deltaLabel} tone={deltaTone} variant="hero" />
            </View>
          ) : null}
          {otherCurrencyCount > 0 ? (
            <Text variant="caption" align="start" className="mt-3 text-white/85">
              {t("home.otherCurrencyFootnote", { count: otherCurrencyCount })}
            </Text>
          ) : null}
          {!hasParsedTotals ? (
            <Text variant="caption" align="start" className="mt-2 text-white/85">
              {t("home.monthTotalHint")}
            </Text>
          ) : null}
        </View>
      </HeroSurface>
    </View>
  );
}
