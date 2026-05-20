import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

type HomeMonthSelectorProps = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
};

export function HomeMonthSelector({
  monthLabel,
  onPrevious,
  onNext,
  canGoNext,
}: HomeMonthSelectorProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View className="mx-5 mb-2 flex-row items-center justify-between rounded-2xl bg-surface-muted px-3 py-2">
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("home.previousMonth")}
        onPress={onPrevious}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated shadow-card"
      >
        <Ionicons name="chevron-back" size={20} color={iconColors.primary} />
      </PressableScale>
      <View
        className="rounded-full bg-surface-elevated px-5 py-2.5 shadow-card"
        accessibilityRole="header"
      >
        <Text variant="label" align="center">
          {monthLabel}
        </Text>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("home.nextMonth")}
        onPress={onNext}
        disabled={!canGoNext}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated shadow-card"
        style={{ opacity: canGoNext ? 1 : 0.35 }}
      >
        <Ionicons name="chevron-forward" size={20} color={iconColors.primary} />
      </PressableScale>
    </View>
  );
}
