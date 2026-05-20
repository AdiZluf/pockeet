import { useCallback } from "react";
import { useRouter } from "expo-router";

import { useCaptureSessionStore } from "../stores/captureSessionStore";
import { usePickReceiptGallery } from "./usePickReceiptGallery";
import { useUploadReceiptPdf } from "./useUploadReceiptPdf";

export function useAddReceipt() {
  const router = useRouter();
  const reset = useCaptureSessionStore((s) => s.reset);
  const pickGallery = usePickReceiptGallery();
  const uploadPdf = useUploadReceiptPdf();

  const openCamera = useCallback(() => {
    reset();
    router.push("/capture");
  }, [reset, router]);

  const openGallery = useCallback(async () => {
    reset();
    const added = await pickGallery();
    if (added > 0) {
      router.push("/capture/preview");
    }
  }, [reset, pickGallery, router]);

  const openPdf = useCallback(async () => {
    reset();
    await uploadPdf();
  }, [reset, uploadPdf]);

  return { openCamera, openGallery, openPdf };
}
