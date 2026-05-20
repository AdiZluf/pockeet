import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { ReceiptFilters } from "@/db/receiptFilters";
import { PressableScale, Text } from "@/components/ui";
import { countActiveFilters, isDefaultFilters } from "@/features/receipts/utils/filterParams";
import { buildFilterChips } from "@/features/receipts/utils/filterLabels";
import { useIconColors, useTheme } from "@/theme";
import { cn } from "@/utils/cn";

type ReceiptFilterBarProps = {
  filters: ReceiptFilters;
  onOpenFilters: () => void;
  onChangeFilters: (next: ReceiptFilters) => void;
  onClearAll: () => void;
};

export function ReceiptFilterBar({
  filters,
  onOpenFilters,
  onChangeFilters,
  onClearAll,
}: ReceiptFilterBarProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { colors } = useTheme();
  const activeCount = countActiveFilters(filters);
  const chips = buildFilterChips(filters, t, onChangeFilters);
  const showClear = !isDefaultFilters(filters);
  const filtersActive = activeCount > 0;

  return (
    <View
      className="z-10 border-b border-border-subtle bg-background pb-2"
      style={{ borderBottomColor: colors.borderSubtle }}
    >
      <View className="flex-row items-center gap-2 px-5 pt-1">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("receipts.filters.open")}
          onPress={onOpenFilters}
          className={cn(
            "min-h-[44px] flex-row items-center gap-2 rounded-full px-4 py-2",
            filtersActive ? "bg-accent" : "bg-surface-elevated",
          )}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={filtersActive ? iconColors.inverse : iconColors.primary}
          />
          <Text
            variant="label"
            className={cn("font-semibold", filtersActive && "text-foreground-inverse")}
          >
            {t("receipts.filters.title")}
          </Text>
          {activeCount > 0 ? (
            <View className="min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-surface px-1.5">
              <Text variant="micro" className="font-bold text-accent">
                {activeCount}
              </Text>
            </View>
          ) : null}
        </PressableScale>
        {showClear ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("receipts.filters.clearAll")}
            onPress={onClearAll}
            className="min-h-[44px] justify-center rounded-full px-3"
          >
            <Text variant="label" className="font-semibold text-accent">
              {t("receipts.filters.clearAll")}
            </Text>
          </PressableScale>
        ) : null}
      </View>
      {chips.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-5 pt-3"
        >
          {chips.map((chip) => (
            <PressableScale
              key={chip.id}
              accessibilityRole="button"
              accessibilityLabel={t("receipts.filters.removeChip", { label: chip.label })}
              onPress={chip.onRemove}
              className="min-h-[36px] flex-row items-center gap-1.5 rounded-full border border-border-subtle bg-accent-soft px-3 py-1.5"
            >
              <Text variant="caption" className="font-semibold text-accent">
                {chip.label}
              </Text>
              <Ionicons name="close-circle" size={16} color={iconColors.accent} />
            </PressableScale>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}
