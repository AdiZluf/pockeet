import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Text } from "@/components/ui";
import { resetDemoData, seedDemoData } from "@/features/demo/seedDemoData";
import { resetOnboardingState } from "@/features/onboarding/services/onboardingGate";

type DevSeedActionsProps = {
  onSeeded?: () => void;
};

export function DevSeedActions({ onSeeded }: DevSeedActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();
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
      onSeeded?.();
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
              onSeeded?.();
            } finally {
              setBusy(false);
            }
          })();
        },
      },
    ]);
  };

  const handleResetOnboarding = () => {
    Alert.alert(t("demo.resetOnboardingTitle"), t("demo.resetOnboardingBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("demo.resetOnboardingConfirm"),
        onPress: () => {
          void (async () => {
            try {
              setBusy(true);
              await resetOnboardingState();
              router.replace("/(auth)/onboarding");
            } finally {
              setBusy(false);
            }
          })();
        },
      },
    ]);
  };

  return (
    <View className="gap-3">
      <Text variant="caption" muted align="start" className="leading-5">
        {t("demo.banner")}
      </Text>
      <View className="flex-row flex-wrap gap-x-5 gap-y-2">
        <Pressable disabled={busy} onPress={() => void handleSeed()} accessibilityRole="button">
          <Text variant="label" className="text-accent">
            {t("demo.seed")}
          </Text>
        </Pressable>
        <Pressable disabled={busy} onPress={handleReset} accessibilityRole="button">
          <Text variant="label" muted>
            {t("demo.reset")}
          </Text>
        </Pressable>
        <Pressable disabled={busy} onPress={handleResetOnboarding} accessibilityRole="button">
          <Text variant="label" muted>
            {t("demo.resetOnboarding")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
