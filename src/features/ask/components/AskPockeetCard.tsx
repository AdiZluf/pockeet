import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

const SUGGESTED_KEYS = [
  "ask.suggested.restaurants",
  "ask.suggested.categoryIncrease",
  "ask.suggested.shufersal",
] as const;

type AskPockeetCardProps = {
  onOpen: (prefill?: string) => void;
};

export function AskPockeetCard({ onOpen }: AskPockeetCardProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("ask.cardA11y")}
      onPress={() => onOpen()}
    >
      <Surface variant="elevated" className="gap-4 p-5">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
            <Ionicons name="sparkles-outline" size={22} color={iconColors.accent} />
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text variant="titleMd" align="start">
              {t("ask.title")}
            </Text>
            <Text variant="caption" muted align="start">
              {t("ask.subtitle")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={iconColors.secondary} />
        </View>
        <View className="flex-row flex-wrap gap-2">
          {SUGGESTED_KEYS.map((key) => (
            <PressableScale
              key={key}
              accessibilityRole="button"
              accessibilityLabel={t(key)}
              onPress={() => onOpen(t(key))}
              className="rounded-full bg-surface-muted px-3 py-2"
            >
              <Text variant="caption" align="start" className="leading-5">
                {t(key)}
              </Text>
            </PressableScale>
          ))}
        </View>
      </Surface>
    </PressableScale>
  );
}
