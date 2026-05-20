import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Surface, Text } from "@/components/ui";
import { formatMoney } from "@/utils/money";
import { moneyWritingProps } from "@/utils/rtl";

type HomeMonthHeroProps = {
  monthLabel: string;
  totalMinor: number;
  currencyCode: string;
  hasParsedTotals: boolean;
  usesMockCategories: boolean;
};

export function HomeMonthHero({
  monthLabel,
  totalMinor,
  currencyCode,
  hasParsedTotals,
  usesMockCategories,
}: HomeMonthHeroProps) {
  const { t, i18n } = useTranslation();

  return (
    <View className="px-5 pb-4 pt-2" accessibilityRole="header">
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
              ? formatMoney(totalMinor, currencyCode, i18n.language)
              : t("home.monthTotalPending")}
          </Text>
          <Text variant="body" muted align="start" className="mt-3 font-medium">
            {monthLabel}
          </Text>
          {!hasParsedTotals ? (
            <Text variant="caption" muted align="start" className="mt-2 leading-5">
              {t("home.monthTotalHint")}
            </Text>
          ) : usesMockCategories ? (
            <Text variant="caption" muted align="start" className="mt-2 leading-5">
              {t("home.demoCategoryHint")}
            </Text>
          ) : null}
        </View>
      </Surface>
    </View>
  );
}
