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
    <View className="flex-row items-center justify-center gap-2 px-5 pb-2">
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("home.previousMonth")}
        onPress={onPrevious}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
      >
        <Ionicons name="chevron-back" size={22} color={iconColors.primary} />
      </PressableScale>
      <Text
        variant="label"
        align="center"
        className="min-w-[140px] font-semibold"
        accessibilityRole="header"
      >
        {monthLabel}
      </Text>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("home.nextMonth")}
        onPress={onNext}
        disabled={!canGoNext}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
        style={{ opacity: canGoNext ? 1 : 0.35 }}
      >
        <Ionicons name="chevron-forward" size={22} color={iconColors.primary} />
      </PressableScale>
    </View>
  );
}
