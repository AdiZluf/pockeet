import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { FAB } from "@/components/ui";
import { useOpenCapture } from "@/features/capture/hooks/useOpenCapture";
import { FoundationPlayground } from "@/features/foundation";
import { RecentReceiptsSection } from "@/features/home/components/RecentReceiptsSection";

/**
 * Home tab — recent local receipts + foundations playground (dev reference).
 * @see docs/ux/screens/home.md
 */
export default function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const openCapture = useOpenCapture();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 pb-32 pt-4"
        style={{ paddingTop: insets.top }}
      >
        <RecentReceiptsSection />
        <FoundationPlayground nested />
      </ScrollView>
      <FAB accessibilityLabel={t("fab.scanReceipt")} onPress={openCapture} />
    </View>
  );
}
