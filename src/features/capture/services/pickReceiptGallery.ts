import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { randomUUID } from "expo-crypto";
import type { TFunction } from "i18next";

import { MAX_RECEIPT_PAGES } from "../constants";
import { useCaptureSessionStore } from "../stores/captureSessionStore";

export type PickGalleryResult =
  | { status: "added"; count: number }
  | { status: "canceled" }
  | { status: "denied" }
  | { status: "error"; message: string };

/**
 * Pick receipt images into the capture session (reads store via getState).
 */
export async function pickReceiptGalleryImages(t: TFunction): Promise<PickGalleryResult> {
  try {
    const { canAddMore, images, addImages } = useCaptureSessionStore.getState();

    if (!canAddMore()) {
      Alert.alert(
        t("capture.maxPagesTitle"),
        t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }),
      );
      return { status: "error", message: "max_pages" };
    }

    const remaining = MAX_RECEIPT_PAGES - images.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: Math.max(remaining, 1),
      quality: 0.85,
    });

    if (result.canceled) {
      return { status: "canceled" };
    }

    if (!result.assets?.length) {
      return { status: "canceled" };
    }

    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("capture.galleryDeniedTitle"), t("capture.galleryDeniedBody"));
      return { status: "denied" };
    }

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
      Alert.alert(
        t("capture.maxPagesTitle"),
        t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }),
      );
    }

    if (added === 0) {
      return { status: "error", message: "no_images_added" };
    }

    return { status: "added", count: added };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    Alert.alert(t("addReceipt.galleryFailedTitle"), t("addReceipt.galleryFailedBody"));
    return { status: "error", message };
  }
}
