import { useState } from "react";
import { Alert, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button, Surface, Text } from "@/components/ui";
import { resetDemoData, seedDemoData } from "@/features/demo/seedDemoData";

type DevSeedActionsProps = {
  onSeeded: () => void;
};

export function DevSeedActions({ onSeeded }: DevSeedActionsProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  if (!__DEV__) return null;

  const handleSeed = async () => {
    try {
      setBusy(true);
      const result = await seedDemoData();
      if (result.skipped && result.inserted === 0) {
        Alert.alert(t("demo.alreadySeededTitle"), t("demo.alreadySeededBody"));
        return;
      }
      Alert.alert(t("demo.seededTitle"), t("demo.seededBody", { count: result.inserted }));
      onSeeded();
    } catch {
      Alert.alert(t("demo.seedFailedTitle"), t("demo.seedFailedBody"));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    Alert.alert(t("demo.resetTitle"), t("demo.resetBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("demo.resetConfirm"),
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              setBusy(true);
              await resetDemoData();
              onSeeded();
            } finally {
              setBusy(false);
            }
          })();
        },
      },
    ]);
  };

  return (
    <Surface variant="inset" className="mx-5 gap-3 p-4">
      <Text variant="caption" muted>
        {t("demo.banner")}
      </Text>
      <View className="flex-row gap-2">
        <Button
          variant="secondary"
          label={t("demo.seed")}
          onPress={() => void handleSeed()}
          block={false}
          className="flex-1"
          loading={busy}
          disabled={busy}
        />
        <Button
          variant="text"
          label={t("demo.reset")}
          onPress={handleReset}
          block={false}
          className="flex-1"
          disabled={busy}
        />
      </View>
    </Surface>
  );
}
