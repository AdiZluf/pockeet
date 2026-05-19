import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { FAB, Text } from "@/components/ui";

/**
 * Receipts tab placeholder — list UI not implemented.
 * @see docs/ux/screens/receipts-list.md
 */
export default function ReceiptsTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-5"
      style={{ paddingTop: insets.top }}
    >
      <Text variant="titleMd">{t("tabs.receipts")}</Text>
      <Text variant="body" muted className="mt-2 text-center">
        Scaffold only — history list comes in product phase.
      </Text>
      <FAB
        accessibilityLabel={t("fab.scanReceipt")}
        onPress={() => undefined}
      />
    </View>
  );
}
