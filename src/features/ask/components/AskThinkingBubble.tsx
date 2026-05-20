import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

export function AskThinkingBubble() {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View className="self-start max-w-[85%]">
      <Surface variant="elevated" className="flex-row items-center gap-3 px-4 py-3.5">
        <ActivityIndicator size="small" color={iconColors.accent} />
        <Text variant="body" muted align="start">
          {t("ask.thinking")}
        </Text>
      </Surface>
    </View>
  );
}
