import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale, SectionEyebrow, Text } from "@/components/ui";
import type { ReceiptStatusFilter } from "@/db/receiptFilters";
import type { StatusCounts } from "@/features/home/services/homeSummary";
import { useTheme } from "@/theme";
import { cn } from "@/utils/cn";

type StatusItem = {
  key: keyof StatusCounts;
  filter: ReceiptStatusFilter;
  labelKey: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  chipClass: string;
  fg: string;
};

const STATUS_ITEMS: StatusItem[] = [
  {
    key: "processing",
    filter: "processing",
    labelKey: "home.statusProcessing",
    icon: "sync-outline",
    chipClass: "bg-status-processing-bg",
    fg: "status-processing",
  },
  {
    key: "needs_review",
    filter: "needs_review",
    labelKey: "home.statusNeedsReview",
    icon: "alert-circle-outline",
    chipClass: "bg-status-review-bg",
    fg: "status-review",
  },
  {
    key: "ready",
    filter: "ready",
    labelKey: "home.statusReady",
    icon: "checkmark-circle-outline",
    chipClass: "bg-status-ready-bg",
    fg: "status-ready",
  },
  {
    key: "failed",
    filter: "failed",
    labelKey: "home.statusFailed",
    icon: "close-circle-outline",
    chipClass: "bg-status-failed-bg",
    fg: "status-failed",
  },
];

type HomeStatusOverviewProps = {
  counts: StatusCounts;
  onStatusPress: (status: ReceiptStatusFilter) => void;
};

export function HomeStatusOverview({ counts, onStatusPress }: HomeStatusOverviewProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const iconColor = (fg: string) => {
    if (fg === "status-processing") return colors.status.processing.fg;
    if (fg === "status-review") return colors.status.review.fg;
    if (fg === "status-ready") return colors.status.ready.fg;
    return colors.status.failed.fg;
  };

  const visible = STATUS_ITEMS.filter((item) => counts[item.key] > 0);
  if (visible.length === 0) return null;

  const summary = visible
    .map((item) => `${t(item.labelKey)} ${counts[item.key]}`)
    .join(", ");

  return (
    <View className="pb-4 pt-6">
      <SectionEyebrow title={t("home.statusOverview")} className="mb-3" />
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
            className={cn(
              "min-h-[44px] flex-row items-center gap-2 rounded-full px-4 py-2 shadow-card",
              item.chipClass,
            )}
          >
            <Ionicons name={item.icon} size={18} color={iconColor(item.fg)} />
            <Text variant="label">{t(item.labelKey)}</Text>
            <Text variant="label" tabular muted>
              {counts[item.key]}
            </Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}
