import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { ReceiptFilters } from "@/db/receiptFilters";
import { PressableScale, Text } from "@/components/ui";
import { countActiveFilters, isDefaultFilters } from "@/features/receipts/utils/filterParams";
import { buildFilterChips } from "@/features/receipts/utils/filterLabels";
import { useIconColors } from "@/theme";

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
  const activeCount = countActiveFilters(filters);
  const chips = buildFilterChips(filters, t, onChangeFilters);
  const showClear = !isDefaultFilters(filters);

  return (
    <View className="gap-3 pb-2">
      <View className="flex-row items-center gap-2 px-5">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("receipts.filters.open")}
          onPress={onOpenFilters}
          className="min-h-[44px] flex-row items-center gap-2 rounded-full bg-surface-elevated px-4 py-2"
        >
          <Ionicons name="options-outline" size={18} color={iconColors.primary} />
          <Text variant="label" className="font-semibold">
            {t("receipts.filters.title")}
          </Text>
          {activeCount > 0 ? (
            <View className="min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5">
              <Text variant="micro" className="font-bold text-foreground-inverse">
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
            className="min-h-[44px] justify-center px-2"
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
          contentContainerClassName="gap-2 px-5"
        >
          {chips.map((chip) => (
            <PressableScale
              key={chip.id}
              accessibilityRole="button"
              accessibilityLabel={t("receipts.filters.removeChip", { label: chip.label })}
              onPress={chip.onRemove}
              className="min-h-[36px] flex-row items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5"
            >
              <Text variant="caption" className="font-medium">
                {chip.label}
              </Text>
              <Ionicons name="close" size={14} color={iconColors.secondary} />
            </PressableScale>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}
