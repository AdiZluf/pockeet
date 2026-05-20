import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

export function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-row items-center gap-2 px-3 pb-4">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full"
        >
          <Ionicons name="chevron-back" size={24} color={iconColors.primary} />
        </PressableScale>
        <Text variant="titleLg" align="start" className="flex-1">
          {t("settings.title")}
        </Text>
      </View>
    </View>
  );
}
