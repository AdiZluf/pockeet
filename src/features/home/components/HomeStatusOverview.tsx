import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { PressableScale, SectionHeader, Text } from "@/components/ui";
import type { StatusCounts } from "@/features/home/services/homeSummary";
import type { ReceiptStatusFilter } from "@/db/receiptFilters";

type StatusItem = {
  key: keyof StatusCounts;
  filter: ReceiptStatusFilter;
  labelKey: string;
  colorClass: string;
};

const STATUS_ITEMS: StatusItem[] = [
  { key: "processing", filter: "processing", labelKey: "home.statusProcessing", colorClass: "bg-status-processing" },
  { key: "needs_review", filter: "needs_review", labelKey: "home.statusNeedsReview", colorClass: "bg-status-review" },
  { key: "ready", filter: "ready", labelKey: "home.statusReady", colorClass: "bg-status-ready" },
  { key: "failed", filter: "failed", labelKey: "home.statusFailed", colorClass: "bg-status-failed" },
];

type HomeStatusOverviewProps = {
  counts: StatusCounts;
  onStatusPress: (status: ReceiptStatusFilter) => void;
};

export function HomeStatusOverview({ counts, onStatusPress }: HomeStatusOverviewProps) {
  const { t } = useTranslation();

  const visible = STATUS_ITEMS.filter((item) => counts[item.key] > 0);
  if (visible.length === 0) return null;

  const summary = visible
    .map((item) => `${t(item.labelKey)} ${counts[item.key]}`)
    .join(", ");

  return (
    <View className="pb-2 pt-4">
      <SectionHeader title={t("home.statusOverview")} className="mb-3" />
      <View
        className="flex-row flex-wrap gap-2 px-5"
        accessibilityLabel={t("home.statusOverviewA11y", { summary })}
      >
        {visible.map((item) => (
          <PressableScale
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={t("home.statusChipA11y", {
              label: t(item.labelKey),
              count: counts[item.key],
            })}
            onPress={() => onStatusPress(item.filter)}
            className="min-h-[44px] flex-row items-center gap-2 rounded-full bg-surface-elevated px-4 py-2"
          >
            <View className={`h-2 w-2 rounded-full ${item.colorClass}`} accessibilityElementsHidden />
            <Text variant="label" className="font-medium">
              {t(item.labelKey)}
            </Text>
            <Text variant="label" tabular muted>
              {counts[item.key]}
            </Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}
