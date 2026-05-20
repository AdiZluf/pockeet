import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DividerList, ElevatedGroup, ListRow, PressableScale, Text } from "@/components/ui";
import { setAppLocale, type AppLocale } from "@/i18n";
import { useIconColors } from "@/theme";
import { getBackChevronIcon } from "@/utils/rtl";

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const currentLocale = (i18n.language === "he" ? "he" : "en") as AppLocale;

  const selectLocale = (locale: AppLocale) => {
    if (locale === currentLocale) return;
    void setAppLocale(locale);
  };

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
          <Ionicons name={getBackChevronIcon()} size={24} color={iconColors.primary} />
        </PressableScale>
        <Text variant="titleLg" align="start" className="flex-1">
          {t("settings.title")}
        </Text>
      </View>

      <View className="gap-6 px-5">
        <View className="gap-3">
          <Text variant="micro" muted align="start" className="uppercase tracking-wide">
            {t("settings.languageSection")}
          </Text>
          <ElevatedGroup className="mx-0">
            <DividerList insetStart={false}>
              <ListRow
                title={<Text variant="bodyLg" align="start">{t("settings.languageEn")}</Text>}
                trailing={
                  currentLocale === "en" ? (
                    <Ionicons name="checkmark" size={22} color={iconColors.accent} />
                  ) : null
                }
                onPress={() => selectLocale("en")}
                accessibilityLabel={
                  currentLocale === "en"
                    ? t("settings.languageEnA11ySelected")
                    : t("settings.languageEnA11y")
                }
              />
              <ListRow
                title={<Text variant="bodyLg" align="start">{t("settings.languageHe")}</Text>}
                trailing={
                  currentLocale === "he" ? (
                    <Ionicons name="checkmark" size={22} color={iconColors.accent} />
                  ) : null
                }
                onPress={() => selectLocale("he")}
                accessibilityLabel={
                  currentLocale === "he"
                    ? t("settings.languageHeA11ySelected")
                    : t("settings.languageHeA11y")
                }
              />
            </DividerList>
          </ElevatedGroup>
          <Text variant="caption" muted align="start" className="leading-5">
            {t("settings.languageReloadHint")}
          </Text>
        </View>
      </View>
    </View>
  );
}
