import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ElevatedGroup, PressableScale, SectionHeader, Text } from "@/components/ui";
import type { CategoryBreakdownRow } from "@/features/home/services/homeSummary";
import { formatMoney, moneyTextProps } from "@/utils/money";

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
  onCategoryPress?: (categoryId: string) => void;
};

export function CategoryBreakdownSection({
  categories,
  currencyCode,
  onCategoryPress,
}: CategoryBreakdownSectionProps) {
  const { t } = useTranslation();

  if (categories.length === 0) return null;

  const top = categories[0];
  const chartSummary =
    top != null
      ? t("home.categoryChartSummary", {
          name: top.name,
          percent: top.percent,
          amount: formatMoney(top.amountMinor, currencyCode),
        })
      : undefined;

  return (
    <View className="pb-2 pt-6">
      <SectionHeader title={t("home.categoryBreakdown")} className="mb-3" />
      <ElevatedGroup>
        <View className="gap-5 px-5 py-5" accessibilityLabel={chartSummary}>
          {categories.map((row, index) => {
            const rowContent = (
              <>
                <View className="flex-row items-baseline justify-between gap-4">
                  <Text variant="bodyLg" align="start" className="flex-1 font-semibold">
                    {row.name}
                  </Text>
                  <Text variant="label" muted tabular align="end" {...moneyTextProps}>
                    {formatMoney(row.amountMinor, currencyCode)}
                  </Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <View
                    className={`h-full rounded-full ${CHART_BAR_CLASSES[index % CHART_BAR_CLASSES.length]}`}
                    style={{ width: `${Math.max(row.percent, 5)}%` }}
                    accessibilityLabel={t("home.categoryBarA11y", {
                      name: row.name,
                      percent: row.percent,
                    })}
                  />
                </View>
              </>
            );

            if (!onCategoryPress) {
              return (
                <View key={row.categoryId} className="gap-2.5">
                  {rowContent}
                </View>
              );
            }

            return (
              <PressableScale
                key={row.categoryId}
                accessibilityRole="button"
                accessibilityLabel={t("home.categoryRowA11y", { name: row.name })}
                onPress={() => onCategoryPress(row.categoryId)}
                className="gap-2.5"
              >
                {rowContent}
              </PressableScale>
            );
          })}
        </View>
      </ElevatedGroup>
    </View>
  );
}
