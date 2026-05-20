import { Linking, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Button, Surface, Text } from "@/components/ui";

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
    <View className="flex-1 items-center justify-center px-6">
      <Surface variant="elevated" className="w-full max-w-[340px] items-center gap-4 p-6">
        <Surface variant="inset" className="h-16 w-16 items-center justify-center rounded-full">
          <Ionicons name="camera-outline" size={32} color="#1F6F78" />
        </Surface>
        <Text variant="titleMd" className="text-center">
          {t("capture.permissionTitle")}
        </Text>
        <Text variant="body" muted className="text-center leading-6">
          {t("capture.permissionBody")}
        </Text>
        <View className="mt-2 w-full gap-3">
          {showRequest && onRequest ? (
            <Button label={t("capture.allowCamera")} onPress={onRequest} />
          ) : (
            <Button label={t("capture.openSettings")} onPress={() => void Linking.openSettings()} />
          )}
          <Button variant="text" label={t("common.cancel")} onPress={onClose} />
        </View>
      </Surface>
    </View>
  );
}
