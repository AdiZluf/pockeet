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
    <Surface variant="elevated" className="overflow-hidden">
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("ask.cardA11y")}
        onPress={() => onOpen()}
        className="gap-4 p-5"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft">
            <Ionicons name="sparkles" size={22} color={iconColors.accent} />
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="titleMd" align="start">
              {t("ask.title")}
            </Text>
            <Text variant="caption" muted align="start" className="leading-5">
              {t("ask.subtitle")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={iconColors.secondary} />
        </View>
      </PressableScale>
      <View className="flex-row flex-wrap gap-2 border-t border-border-subtle px-5 pb-5 pt-0">
        {SUGGESTED_KEYS.map((key) => (
          <PressableScale
            key={key}
            accessibilityRole="button"
            accessibilityLabel={t(key)}
            onPress={() => onOpen(t(key))}
            className="mt-4 rounded-full border border-border-subtle bg-surface-muted px-3 py-2"
          >
            <Text variant="caption" align="start" className="leading-5">
              {t(key)}
            </Text>
          </PressableScale>
        ))}
      </View>
    </Surface>
  );
}
