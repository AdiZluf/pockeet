import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { GradientIconWell, PressableScale, SectionEyebrow, Surface, Text } from "@/components/ui";

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

  return (
    <View className="gap-8 py-6">
      <View className="items-center gap-4 px-4">
        <GradientIconWell name="sparkles" size={80} iconSize={36} />
        <Text variant="titleLg" align="center">
          {t("ask.emptyTitle")}
        </Text>
        <Text variant="bodyLg" muted align="center" className="max-w-[300px] leading-6">
          {t("ask.emptyHint")}
        </Text>
      </View>
      <View className="gap-3">
        <SectionEyebrow title={t("ask.suggestionsLabel")} className="px-0" />
        <View className="flex-row flex-wrap gap-2">
          {SUGGESTED_KEYS.map((key) => (
            <PressableScale
              key={key}
              accessibilityRole="button"
              accessibilityLabel={t(key)}
              onPress={() => onSuggestionPress(t(key))}
              className="min-h-[72px] min-w-[46%] flex-1"
            >
              <Surface variant="elevated" className="min-h-[72px] justify-center p-4">
                <Text variant="label" align="start" className="leading-5">
                  {t(key)}
                </Text>
              </Surface>
            </PressableScale>
          ))}
        </View>
      </View>
    </View>
  );
}
