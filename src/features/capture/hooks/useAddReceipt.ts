import { Alert } from "react-native";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { pickReceiptGalleryImages } from "../services/pickReceiptGallery";
import { useCaptureSessionStore } from "../stores/captureSessionStore";
import { useUploadReceiptPdf } from "./useUploadReceiptPdf";

export function useAddReceipt() {
  const { t } = useTranslation();
  const router = useRouter();
  const reset = useCaptureSessionStore((s) => s.reset);
  const uploadPdf = useUploadReceiptPdf();

  const openCamera = useCallback(async () => {
    reset();
    router.push("/capture");
  }, [reset, router]);

  const openGallery = useCallback(async () => {
    reset();

    const result = await pickReceiptGalleryImages(t);
    if (result.status !== "added") {
      return;
    }

    const imageCount = useCaptureSessionStore.getState().images.length;
    if (imageCount === 0) {
      Alert.alert(t("addReceipt.galleryFailedTitle"), t("addReceipt.galleryFailedBody"));
      return;
    }

    router.push("/capture/preview");
  }, [reset, router, t]);

  const openPdf = useCallback(async () => {
    reset();
    await uploadPdf();
  }, [reset, uploadPdf]);

  return {
    openCamera,
    openGallery,
    openPdf,
  };
}
