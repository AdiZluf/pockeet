import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { FAB, ScreenHeader } from "@/components/ui";
import { useOpenCapture } from "@/features/capture/hooks/useOpenCapture";
import { ReceiptsListView } from "@/features/receipts/components/ReceiptsListView";

/**
 * Receipts tab — local history grouped by month.
 * @see docs/ux/screens/receipts-list.md
 */
export default function ReceiptsTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const openCapture = useOpenCapture();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScreenHeader title={t("tabs.receipts")} subtitle={t("receipts.subtitle")} large />
      <ReceiptsListView />
      <FAB accessibilityLabel={t("fab.scanReceipt")} onPress={openCapture} />
    </View>
  );
}
