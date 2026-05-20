import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { FilterChip, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

const SUGGESTED_KEYS = [
  "ask.suggested.restaurants",
  "ask.suggested.categoryIncrease",
  "ask.suggested.shufersal",
  "ask.suggested.monthTotal",
] as const;

type AskEmptyStateProps = {
  onSuggestionPress: (text: string) => void;
};

export function AskEmptyState({ onSuggestionPress }: AskEmptyStateProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View className="gap-6 py-4">
      <View className="items-center gap-3 px-4">
        <Surface variant="inset" className="h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft">
          <Ionicons name="chatbubbles-outline" size={32} color={iconColors.accent} />
        </Surface>
        <Text variant="titleMd" align="center">
          {t("ask.emptyTitle")}
        </Text>
        <Text variant="body" muted align="center" className="max-w-[300px] leading-6">
          {t("ask.emptyHint")}
        </Text>
      </View>
      <View className="gap-2">
        <Text variant="micro" muted align="start" className="uppercase tracking-wide">
          {t("ask.suggestionsLabel")}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {SUGGESTED_KEYS.map((key) => (
            <FilterChip
              key={key}
              label={t(key)}
              selected={false}
              onPress={() => onSuggestionPress(t(key))}
              className="border border-border-subtle bg-surface-elevated"
            />
          ))}
        </View>
      </View>
    </View>
  );
}
