import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { categorySeeds } from "@/db/seed/categories";
import {
  DEFAULT_RECEIPT_FILTERS,
  type ReceiptFilters,
  type ReceiptStatusFilter,
} from "@/db/receiptFilters";
import { Button, PressableScale, Sheet, Text } from "@/components/ui";
import { countReceiptsFiltered } from "@/db/repositories/receiptRepository";
import { monthKeyFromDate } from "@/features/receipts/utils/filterParams";
import { formatMonthChipLabel } from "@/features/receipts/utils/filterLabels";
import { cn } from "@/utils/cn";

type PeriodPreset = "this_month" | "last_month" | "last_3_months" | "custom" | null;

type ReceiptFiltersSheetProps = {
  visible: boolean;
  initial: ReceiptFilters;
  onClose: () => void;
  onApply: (filters: ReceiptFilters) => void;
};

const STATUS_OPTIONS: ReceiptStatusFilter[] = [
  "all",
  "processing",
  "needs_review",
  "ready",
  "failed",
];

function startOfMonthOffset(monthsAgo: number): string {
  const d = new Date();
  return monthKeyFromDate(new Date(d.getFullYear(), d.getMonth() - monthsAgo, 1));
}

export function ReceiptFiltersSheet({
  visible,
  initial,
  onClose,
  onApply,
}: ReceiptFiltersSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ReceiptFilters>(initial);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>(null);

  useEffect(() => {
    if (visible) {
      setDraft(initial);
      setPeriodPreset(initial.month ? "this_month" : initial.from || initial.to ? "custom" : null);
    }
  }, [visible, initial]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    void countReceiptsFiltered(draft).then((n) => {
      if (!cancelled) setPreviewCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [draft, visible]);

  const toggleCategory = (categoryId: string) => {
    setDraft((prev) => {
      const has = prev.categories.includes(categoryId);
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((c) => c !== categoryId)
          : [...prev.categories, categoryId],
      };
    });
  };

  const applyPeriod = (preset: PeriodPreset) => {
    setPeriodPreset(preset);
    if (preset === "this_month") {
      setDraft((p) => ({ ...p, month: startOfMonthOffset(0), from: undefined, to: undefined }));
    } else if (preset === "last_month") {
      setDraft((p) => ({ ...p, month: startOfMonthOffset(1), from: undefined, to: undefined }));
    } else if (preset === "last_3_months") {
      const to = new Date();
      const from = new Date(to.getFullYear(), to.getMonth() - 2, 1);
      setDraft((p) => ({
        ...p,
        month: undefined,
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
      }));
    } else if (preset === "custom") {
      setDraft((p) => ({ ...p, month: undefined }));
    }
  };

  const recentMonths = Array.from({ length: 12 }, (_, i) => startOfMonthOffset(i));

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={t("receipts.filters.sheetTitle")}
      footer={
        <>
          <Button
            label={
              previewCount != null
                ? t("receipts.filters.applyCount", { count: previewCount })
                : t("receipts.filters.apply")
            }
            onPress={() => {
              onApply(draft);
              onClose();
            }}
          />
          <Button
            variant="secondary"
            label={t("receipts.filters.reset")}
            onPress={() => {
              setDraft(DEFAULT_RECEIPT_FILTERS);
              setPeriodPreset(null);
            }}
          />
        </>
      }
    >
      <ScrollView className="max-h-[60vh]" showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-4">
          <Text variant="body" muted align="start" className="leading-6">
            {t("receipts.filters.sheetHint")}
          </Text>
          <View className="gap-3">
            <Text variant="label" muted align="start" className="uppercase tracking-wide">
              {t("receipts.filters.period")}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {(
                [
                  ["this_month", "receipts.filters.thisMonth"],
                  ["last_month", "receipts.filters.lastMonth"],
                  ["last_3_months", "receipts.filters.last3Months"],
                ] as const
              ).map(([preset, labelKey]) => (
                <PressableScale
                  key={preset}
                  accessibilityRole="button"
                  onPress={() => applyPeriod(preset)}
                  className={cn(
                    "rounded-full px-3 py-2",
                    periodPreset === preset ? "bg-accent" : "bg-surface-muted",
                  )}
                >
                  <Text
                    variant="caption"
                    className={periodPreset === preset ? "font-semibold text-foreground-inverse" : undefined}
                  >
                    {t(labelKey)}
                  </Text>
                </PressableScale>
              ))}
            </View>
            <View className="flex-row flex-wrap gap-2">
              {recentMonths.map((key) => (
                <PressableScale
                  key={key}
                  accessibilityRole="button"
                  onPress={() => {
                    setPeriodPreset(null);
                    setDraft((p) => ({ ...p, month: key, from: undefined, to: undefined }));
                  }}
                  className={cn(
                    "rounded-full px-3 py-2",
                    draft.month === key ? "bg-accent" : "bg-surface-muted",
                  )}
                >
                  <Text
                    variant="caption"
                    className={draft.month === key ? "font-semibold text-foreground-inverse" : undefined}
                  >
                    {formatMonthChipLabel(key)}
                  </Text>
                </PressableScale>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text variant="label" muted align="start" className="uppercase tracking-wide">
              {t("receipts.filters.categories")}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categorySeeds.map((cat) => {
                const selected = draft.categories.includes(cat.id);
                return (
                  <PressableScale
                    key={cat.id}
                    accessibilityRole="button"
                    onPress={() => toggleCategory(cat.id)}
                    className={cn(
                      "rounded-full px-3 py-2",
                      selected ? "bg-accent" : "bg-surface-muted",
                    )}
                  >
                    <Text
                      variant="caption"
                      className={selected ? "font-semibold text-foreground-inverse" : undefined}
                    >
                      {cat.nameEn}
                    </Text>
                  </PressableScale>
                );
              })}
            </View>
          </View>

          <View className="gap-3">
            <Text variant="label" muted align="start" className="uppercase tracking-wide">
              {t("receipts.filters.statusLabel")}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <PressableScale
                  key={status}
                  accessibilityRole="button"
                  onPress={() => setDraft((p) => ({ ...p, status }))}
                  className={cn(
                    "rounded-full px-3 py-2",
                    draft.status === status ? "bg-accent" : "bg-surface-muted",
                  )}
                >
                  <Text
                    variant="caption"
                    className={
                      draft.status === status ? "font-semibold text-foreground-inverse" : undefined
                    }
                  >
                    {t(`receipts.filters.status.${status}`)}
                  </Text>
                </PressableScale>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Sheet>
  );
}
