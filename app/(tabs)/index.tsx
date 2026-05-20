import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { FAB } from "@/components/ui";
import { useOpenCapture } from "@/features/capture/hooks/useOpenCapture";
import { HomeScreenContent } from "@/features/home/components/HomeScreenContent";

/**
 * Home tab — monthly snapshot, queues, and recent receipts.
 * @see docs/ux/screens/home.md
 */
export default function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const openCapture = useOpenCapture();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <HomeScreenContent />
      <FAB accessibilityLabel={t("fab.scanReceipt")} onPress={openCapture} />
    </View>
  );
}
