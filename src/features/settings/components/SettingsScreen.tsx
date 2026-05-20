import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { DevSeedActions } from "@/features/home/components/DevSeedActions";
import { ElevatedGroup, ListRow, ModalHeader, Section, Text } from "@/components/ui";
import { useDisplayCurrency } from "@/features/settings/hooks/useDisplayCurrency";

import { CurrencySettingRow } from "./CurrencySettingRow";

export function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const version = (Constants.expoConfig?.version ?? Constants.manifest?.version ?? "—") as string;
  const { currency, setCurrency } = useDisplayCurrency();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ModalHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
        onClose={() => router.back()}
        closeIcon="chevron-down"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 px-5 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <CurrencySettingRow value={currency} onChange={setCurrency} />

        <Section title={t("settings.aboutSection")}>
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
        </Section>

        {__DEV__ ? (
          <Section title={t("settings.developerSection")}>
            <ElevatedGroup className="mx-0 gap-0 p-4">
              <DevSeedActions onSeeded={() => router.back()} />
            </ElevatedGroup>
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}
