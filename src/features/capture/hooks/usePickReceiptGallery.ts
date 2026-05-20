import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { randomUUID } from "expo-crypto";

import { MAX_RECEIPT_PAGES } from "../constants";
import { useCaptureSessionStore } from "../stores/captureSessionStore";

/**
 * Pick one or more receipt images from the photo library into the capture session.
 * @returns number of images added
 */
export function usePickReceiptGallery() {
  const { t } = useTranslation();
  const addImages = useCaptureSessionStore((s) => s.addImages);
  const canAddMore = useCaptureSessionStore((s) => s.canAddMore);
  const images = useCaptureSessionStore((s) => s.images);

  return async (): Promise<number> => {
    if (!canAddMore()) {
      Alert.alert(t("capture.maxPagesTitle"), t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }));
      return 0;
    }

    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPermission.granted) {
      Alert.alert(t("capture.galleryDeniedTitle"), t("capture.galleryDeniedBody"));
      return 0;
    }

    const remaining = MAX_RECEIPT_PAGES - images.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.85,
    });

    if (result.canceled) return 0;

    const incoming = result.assets.map((asset) => ({
      id: randomUUID(),
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    }));

    const added = addImages(incoming);
    if (added > 0) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (added < incoming.length) {
      Alert.alert(t("capture.maxPagesTitle"), t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }));
    }
    return added;
  };
}
