import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { GroupedList, Section, Text } from "@/components/ui";
import type { CategoryBreakdownRow } from "@/features/home/services/homeSummary";
import { formatMoney } from "@/utils/money";
import { moneyTextProps } from "@/utils/rtl";

const CHART_BAR_CLASSES = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
] as const;

type CategoryBreakdownSectionProps = {
  categories: CategoryBreakdownRow[];
  currencyCode: string;
  usesMockCategories: boolean;
};

export function CategoryBreakdownSection({
  categories,
  currencyCode,
  usesMockCategories,
}: CategoryBreakdownSectionProps) {
  const { t, i18n } = useTranslation();

  if (categories.length === 0) return null;

  const top = categories[0];
  const chartSummary =
    top != null
      ? t("home.categoryChartSummary", {
          name: top.name,
          percent: top.percent,
          amount: formatMoney(top.amountMinor, currencyCode, i18n.language),
        })
      : undefined;

  return (
    <Section
      title={t("home.categoryBreakdown")}
      subtitle={usesMockCategories ? t("home.categoryBreakdownDemo") : undefined}
      className="px-5"
    >
      <GroupedList accessibilityLabel={chartSummary}>
        {categories.map((row, index) => (
          <View key={row.categoryId} className="gap-2.5 px-4 py-3.5">
            <View className="flex-row items-baseline justify-between gap-3">
              <Text variant="label">{row.name}</Text>
              <Text variant="caption" muted tabular {...moneyTextProps}>
                {formatMoney(row.amountMinor, currencyCode, i18n.language)}
              </Text>
            </View>
            <View className="h-2.5 overflow-hidden rounded-full bg-accent-soft">
              <View
                className={`h-full rounded-full opacity-[0.85] ${CHART_BAR_CLASSES[index % CHART_BAR_CLASSES.length]}`}
                style={{ width: `${Math.max(row.percent, 6)}%` }}
                accessibilityLabel={t("home.categoryBarA11y", {
                  name: row.name,
                  percent: row.percent,
                })}
              />
            </View>
          </View>
        ))}
      </GroupedList>
    </Section>
  );
}
