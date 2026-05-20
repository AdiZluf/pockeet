import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Button,
  CanvasBackground,
  FadeInView,
  GradientIconWell,
  HeroSurface,
  Surface,
  Text,
} from "@/components/ui";

import { markGuestSession } from "../services/onboardingGate";
import { AuthProviderButton } from "./AuthProviderButton";

export function AuthEntryView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGuest = async () => {
    await markGuestSession();
    router.replace("/(tabs)");
  };

  return (
    <CanvasBackground
      accessibilityLabel={t("onboarding.authScreenLabel")}
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <FadeInView className="flex-1 justify-center gap-8 px-5">
        <HeroSurface className="w-full max-w-[320px] self-center">
          <View className="items-center gap-4 px-6 py-10">
            <GradientIconWell name="wallet-outline" size={72} iconSize={32} />
            <Text variant="titleLg" align="center" className="text-foreground-onAccent">
              {t("onboarding.authTitle")}
            </Text>
            <Text variant="bodyLg" align="center" className="text-foreground-onAccent/85 leading-6">
              {t("onboarding.authSubtitle")}
            </Text>
          </View>
        </HeroSurface>

        <View className="gap-4">
          <Button label={t("onboarding.continueGuest")} onPress={() => void handleGuest()} />
          <Text variant="caption" muted align="center" className="px-2 leading-5">
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
          <Surface variant="elevated" className="p-0">
            <AuthProviderButton
              icon="logo-apple"
              label={t("onboarding.continueApple")}
              comingSoon
              className="border-0 bg-transparent shadow-none"
            />
          </Surface>
          <Surface variant="elevated" className="p-0">
            <AuthProviderButton
              icon="logo-google"
              label={t("onboarding.continueGoogle")}
              comingSoon
              className="border-0 bg-transparent shadow-none"
            />
          </Surface>
        </View>
      </FadeInView>
    </CanvasBackground>
  );
}
