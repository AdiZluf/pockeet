import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Surface, Text } from "@/components/ui";
import { formatMoney } from "@/utils/money";

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
    <Surface variant="hero" className="mx-5">
      <View className="h-1 bg-accent" accessibilityElementsHidden />
      <View className="gap-3 px-6 pb-6 pt-5">
        <View className="gap-1">
          <Text variant="caption" muted>
            {t("home.monthTotal")}
          </Text>
          <Text variant="displayXl" tabular className="text-foreground">
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
    </Surface>
  );
}
