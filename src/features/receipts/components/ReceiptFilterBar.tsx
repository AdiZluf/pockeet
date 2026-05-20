import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { ReceiptFilters } from "@/db/receiptFilters";
import { FilterChip, PressableScale, Surface, Text } from "@/components/ui";
import { countActiveFilters, isDefaultFilters } from "@/features/receipts/utils/filterParams";
import { buildFilterChips } from "@/features/receipts/utils/filterLabels";
import { useIconColors } from "@/theme";
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
  const activeCount = countActiveFilters(filters);
  const chips = buildFilterChips(filters, t, onChangeFilters);
  const showClear = !isDefaultFilters(filters);
  const filtersActive = activeCount > 0;

  return (
    <View className="z-10 px-5 pb-3">
      <Surface variant="dock" className="mx-0 gap-0 overflow-hidden p-0">
        <View className="flex-row items-center gap-2 px-4 py-3">
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("receipts.filters.open")}
            onPress={onOpenFilters}
            className={cn(
              "min-h-[44px] flex-row items-center gap-2 rounded-full px-4",
              filtersActive ? "bg-accent shadow-card" : "bg-surface-elevated",
            )}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={filtersActive ? iconColors.inverse : iconColors.primary}
            />
            <Text
              variant="label"
              className={filtersActive ? "text-foreground-inverse" : undefined}
            >
              {t("receipts.filters.title")}
            </Text>
            {activeCount > 0 ? (
              <View className="min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-surface px-1.5">
                <Text variant="micro" className="text-accent">
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
              <Text variant="label" className="text-accent">
                {t("receipts.filters.clearAll")}
              </Text>
            </PressableScale>
          ) : null}
        </View>
        {chips.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 pb-3"
          >
            {chips.map((chip) => (
              <FilterChip
                key={chip.id}
                variant="removable"
                label={chip.label}
                accessibilityLabel={t("receipts.filters.removeChip", { label: chip.label })}
                onPress={chip.onRemove}
              />
            ))}
          </ScrollView>
        ) : null}
      </Surface>
    </View>
  );
}
