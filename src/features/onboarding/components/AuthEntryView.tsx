import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, FadeInView, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

import { markGuestSession } from "../services/onboardingGate";
import { AuthProviderButton } from "./AuthProviderButton";

export function AuthEntryView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();

  const handleGuest = async () => {
    await markGuestSession();
    router.replace("/(tabs)");
  };

  return (
    <View
      className="flex-1 bg-background px-5"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
      accessibilityLabel={t("onboarding.authScreenLabel")}
    >
      <FadeInView className="flex-1 justify-center gap-8">
        <View className="items-center gap-3">
          <Surface variant="hero" className="w-full max-w-[320px] overflow-hidden">
            <View className="h-1 bg-accent" accessibilityElementsHidden />
            <View className="items-center gap-4 bg-accent-soft px-6 py-8">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-surface-elevated border border-border-subtle">
                <Ionicons name="wallet-outline" size={32} color={iconColors.accent} />
              </View>
              <Text variant="titleLg" align="center">
                {t("onboarding.authTitle")}
              </Text>
              <Text variant="body" muted align="center" className="leading-6">
                {t("onboarding.authSubtitle")}
              </Text>
            </View>
          </Surface>
        </View>

        <View className="gap-4">
          <Button label={t("onboarding.continueGuest")} onPress={() => void handleGuest()} />
          <Text variant="caption" muted align="center" className="leading-5 px-2">
            {t("onboarding.guestHint")}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text variant="caption" muted>
            {t("onboarding.or")}
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="gap-3">
          <AuthProviderButton
            icon="logo-apple"
            label={t("onboarding.continueApple")}
            comingSoon
          />
          <AuthProviderButton
            icon="logo-google"
            label={t("onboarding.continueGoogle")}
            comingSoon
          />
        </View>
      </FadeInView>
    </View>
  );
}
