import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Surface, Text } from "@/components/ui";
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

  const deltaLabel =
    deltaMinor == null
      ? null
      : deltaMinor === 0
        ? t("home.deltaSame")
        : deltaMinor > 0
          ? t("home.deltaUp", {
              amount: formatMoney(deltaMinor, currencyCode),
            })
          : t("home.deltaDown", {
              amount: formatMoney(Math.abs(deltaMinor), currencyCode),
            });

  return (
    <View className="px-5 pb-4 pt-3" accessibilityRole="header">
      <Surface variant="hero">
        <View className="h-1 bg-accent" accessibilityElementsHidden />
        <View className="bg-accent-soft px-6 pb-7 pt-5">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-accent" accessibilityElementsHidden />
            <Text variant="caption" muted align="start" className="uppercase tracking-wide">
              {t("home.monthTotal")}
            </Text>
          </View>
          <Text
            variant="displayXl"
            tabular
            align="start"
            className="mt-3 leading-none text-foreground"
            {...moneyWritingProps}
          >
            {hasParsedTotals
              ? formatMoney(totalMinor, currencyCode)
              : t("home.monthTotalPending")}
          </Text>
          {deltaLabel ? (
            <Text variant="caption" muted align="start" className="mt-2 leading-5">
              {deltaLabel}
            </Text>
          ) : null}
          {otherCurrencyCount > 0 ? (
            <Text variant="caption" muted align="start" className="mt-2 leading-5">
              {t("home.otherCurrencyFootnote", { count: otherCurrencyCount })}
            </Text>
          ) : null}
          {!hasParsedTotals ? (
            <Text variant="caption" muted align="start" className="mt-2 leading-5">
              {t("home.monthTotalHint")}
            </Text>
          ) : null}
        </View>
      </Surface>
    </View>
  );
}
