import { Linking, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button, Text } from "@/components/ui";

type CapturePermissionViewProps = {
  onClose: () => void;
  onRequest?: () => void;
  showRequest?: boolean;
};

export function CapturePermissionView({
  onClose,
  onRequest,
  showRequest = false,
}: CapturePermissionViewProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Text variant="titleMd" className="text-center">
        {t("capture.permissionTitle")}
      </Text>
      <Text variant="body" muted className="mt-2 text-center">
        {t("capture.permissionBody")}
      </Text>
      <View className="mt-6 w-full gap-3">
        {showRequest && onRequest ? (
          <Button label={t("capture.allowCamera")} onPress={onRequest} />
        ) : (
          <Button label={t("capture.openSettings")} onPress={() => void Linking.openSettings()} />
        )}
        <Button variant="text" label={t("common.cancel")} onPress={onClose} />
      </View>
    </View>
  );
}
