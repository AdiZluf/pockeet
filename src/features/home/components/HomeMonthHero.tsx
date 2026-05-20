import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/components/ui";
import { formatMoney } from "@/utils/money";
import { moneyTextProps } from "@/utils/rtl";

type HomeMonthHeroProps = {
  totalMinor: number;
  currencyCode: string;
  hasParsedTotals: boolean;
  usesMockCategories: boolean;
};

export function HomeMonthHero({
  totalMinor,
  currencyCode,
  hasParsedTotals,
  usesMockCategories,
}: HomeMonthHeroProps) {
  const { t, i18n } = useTranslation();

  return (
    <View className="mx-5 gap-3" accessibilityRole="header">
      <View className="h-1 w-10 rounded-full bg-accent" accessibilityElementsHidden />
      <View className="gap-1">
        <Text variant="caption" muted>
          {t("home.monthTotal")}
        </Text>
        <Text variant="displayXl" tabular className="text-foreground" {...moneyTextProps}>
          {hasParsedTotals
            ? formatMoney(totalMinor, currencyCode, i18n.language)
            : t("home.monthTotalPending")}
        </Text>
      </View>
      {!hasParsedTotals ? (
        <Text variant="bodySm" muted>
          {t("home.monthTotalHint")}
        </Text>
      ) : usesMockCategories ? (
        <Text variant="caption" muted>
          {t("home.demoCategoryHint")}
        </Text>
      ) : null}
    </View>
  );
}
