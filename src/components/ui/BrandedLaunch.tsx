import { ActivityIndicator, View } from "react-native";

import { useIconColors } from "@/theme";

import { Text } from "./Text";

/** Bootstrap splash — no useTranslation (i18n may still be initializing). */
export function BrandedLaunch() {
  const iconColors = useIconColors();

  return (
    <View
      className="flex-1 items-center justify-center gap-6 bg-background px-8"
      accessibilityLabel="Loading"
    >
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
        <View className="h-6 w-6 rounded-lg bg-accent" accessibilityElementsHidden />
      </View>
      <Text variant="titleMd" align="center" className="font-semibold tracking-tight">
        Pockeet
      </Text>
      <ActivityIndicator color={iconColors.accent} />
    </View>
  );
}
