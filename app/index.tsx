import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { useLaunchRoute } from "@/features/onboarding/hooks/useLaunchRoute";

export default function Index() {
  const { t } = useTranslation();
  const { href, loading } = useLaunchRoute();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator accessibilityLabel={t("common.loading")} />
      </View>
    );
  }

  return <Redirect href={href!} />;
}
