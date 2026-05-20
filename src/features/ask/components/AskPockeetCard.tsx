import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { FilterChip, GradientIconWell, PressableScale, Surface, Text } from "@/components/ui";
import { brandGradients } from "@/theme/gradients";
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
    <View className="overflow-hidden rounded-2xl shadow-raised">
      <LinearGradient
        colors={[...brandGradients.featuredBorder]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 2 }}
      >
        <Surface variant="featured" className="overflow-hidden rounded-[22px]">
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("ask.cardA11y")}
            onPress={() => onOpen()}
            className="flex-row items-center gap-4 p-5"
          >
            <GradientIconWell name="sparkles" size={52} iconSize={26} />
            <View className="min-w-0 flex-1 gap-1">
              <Text variant="titleMd" align="start">
                {t("ask.title")}
              </Text>
              <Text variant="caption" muted align="start" className="leading-5">
                {t("ask.subtitle")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={iconColors.accent} />
          </PressableScale>
          <View className="flex-row flex-wrap gap-2 border-t border-border-subtle px-5 pb-5 pt-4">
            {SUGGESTED_KEYS.map((key) => (
              <FilterChip
                key={key}
                label={t(key)}
                selected={false}
                onPress={() => onOpen(t(key))}
                className="bg-surface-muted"
              />
            ))}
          </View>
        </Surface>
      </LinearGradient>
    </View>
  );
}
