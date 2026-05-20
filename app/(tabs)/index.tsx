import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CanvasBackground } from "@/components/ui";
import { AddReceiptFAB } from "@/features/capture/components/AddReceiptFAB";
import { HomeScreenContent } from "@/features/home/components/HomeScreenContent";

/**
 * Home tab — monthly snapshot, queues, and recent receipts.
 * @see docs/ux/screens/home.md
 */
export default function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  return (
    <CanvasBackground style={{ paddingTop: insets.top }}>
      <HomeScreenContent />
      <AddReceiptFAB />
    </CanvasBackground>
  );
}
