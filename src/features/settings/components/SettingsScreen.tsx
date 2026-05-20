import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { DevSeedActions } from "@/features/home/components/DevSeedActions";
import {
  CanvasBackground,
  ElevatedGroup,
  ListRow,
  ModalHeader,
  SectionEyebrow,
  Surface,
  Text,
} from "@/components/ui";
import { useDisplayCurrency } from "@/features/settings/hooks/useDisplayCurrency";

import { CurrencySettingRow } from "./CurrencySettingRow";

export function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const version = (Constants.expoConfig?.version ?? Constants.manifest?.version ?? "—") as string;
  const { currency, setCurrency } = useDisplayCurrency();

  return (
    <CanvasBackground style={{ paddingTop: insets.top }}>
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

        <View className="gap-3">
          <SectionEyebrow title={t("settings.aboutSection")} className="px-0" />
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
            <SectionEyebrow title={t("settings.developerSection")} className="px-0" />
            <Surface variant="featured" className="p-4">
              <DevSeedActions onSeeded={() => router.back()} />
            </Surface>
          </View>
        ) : null}
      </ScrollView>
    </CanvasBackground>
  );
}
