import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { FAB } from "@/components/ui";
import { FoundationPlayground } from "@/features/foundation";

/**
 * Tab shell for Home. Shows UI foundations until product Home is implemented.
 * @see docs/ux/screens/home.md
 */
export default function HomeTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <FoundationPlayground />
      <FAB
        accessibilityLabel={t("fab.scanReceipt")}
        onPress={() => {
          // Receipt capture flow — docs/ux/screens/capture.md (not implemented)
        }}
      />
    </View>
  );
}
