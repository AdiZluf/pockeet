import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { DevSeedActions } from "@/features/home/components/DevSeedActions";
import { ElevatedGroup, ListRow, PressableScale, Text } from "@/components/ui";
import { useIconColors, useTheme } from "@/theme";

export function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const { colors } = useTheme();
  const version = (Constants.expoConfig?.version ?? Constants.manifest?.version ?? "—") as string;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="items-center pb-2 pt-2">
        <View className="h-1 w-10 rounded-full bg-border" accessibilityElementsHidden />
      </View>

      <View className="flex-row items-center gap-2 px-5 pb-4">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
          style={{ borderWidth: 0.5, borderColor: colors.borderSubtle }}
        >
          <Ionicons name="chevron-back" size={24} color={iconColors.primary} />
        </PressableScale>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text variant="titleLg" align="start">
            {t("settings.title")}
          </Text>
          <Text variant="caption" muted align="start">
            {t("settings.subtitle")}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 px-5 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          <Text variant="micro" muted align="start" className="uppercase tracking-wide">
            {t("settings.aboutSection")}
          </Text>
          <ElevatedGroup className="mx-0">
            <ListRow
              title={<Text variant="bodyLg" align="start">{t("settings.appName")}</Text>}
              trailing={
                <Text variant="body" muted>
                  {t("settings.version", { version })}
                </Text>
              }
            />
          </ElevatedGroup>
        </View>

        {__DEV__ ? (
          <View className="gap-3">
            <Text variant="micro" muted align="start" className="uppercase tracking-wide">
              {t("settings.developerSection")}
            </Text>
            <ElevatedGroup className="mx-0 gap-0 p-4">
              <DevSeedActions onSeeded={() => router.back()} />
            </ElevatedGroup>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
