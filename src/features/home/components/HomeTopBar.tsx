import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale, Text } from "@/components/ui";
import { useIconColors, useTheme } from "@/theme";

export function HomeTopBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const iconColors = useIconColors();
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
      <View className="min-w-0 flex-1 gap-0.5">
        <View className="flex-row items-center gap-2.5">
          <View
            className="h-9 w-9 items-center justify-center rounded-xl bg-accent-soft"
            accessibilityElementsHidden
          >
            <View className="h-3.5 w-3.5 rounded-md bg-accent" />
          </View>
          <Text variant="titleMd" align="start" className="font-semibold tracking-tight">
            {t("home.greeting")}
          </Text>
        </View>
        <Text variant="caption" muted align="start" className="ms-[46px]">
          {t("home.subtitle")}
        </Text>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("settings.open")}
        onPress={() => router.push("/settings")}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
        style={{ borderWidth: 0.5, borderColor: colors.borderSubtle }}
      >
        <Ionicons name="settings-outline" size={22} color={iconColors.secondary} />
      </PressableScale>
    </View>
  );
}
