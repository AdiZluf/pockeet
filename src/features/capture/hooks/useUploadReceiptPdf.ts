import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { pickReceiptPdf } from "../services/pickReceiptPdf";
import { savePdfReceiptLocally } from "../services/savePdfReceiptLocally";
import { useCaptureSessionStore } from "../stores/captureSessionStore";
import { useDefaultCurrency } from "./useDefaultCurrency";

type UploadPdfOptions = {
  /** When true, confirm discarding an in-progress photo session before upload. */
  replaceSession?: boolean;
};

export function useUploadReceiptPdf() {
  const { t } = useTranslation();
  const router = useRouter();
  const currencyCode = useDefaultCurrency();
  const reset = useCaptureSessionStore((s) => s.reset);

  const runUpload = async () => {
    const picked = await pickReceiptPdf();
    if (!picked) return;

    const receiptId = await savePdfReceiptLocally(picked.uri, picked.name, currencyCode);
    reset();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(`/receipt/${receiptId}/processing`);
  };

  return async (options?: UploadPdfOptions) => {
    const images = useCaptureSessionStore.getState().images;

    if (images.length > 0 && !options?.replaceSession) {
      Alert.alert(t("capture.pdfSessionTitle"), t("capture.pdfSessionBody"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("capture.continue"),
          onPress: () => router.push("/capture/preview"),
        },
      ]);
      return;
    }

    if (images.length > 0 && options?.replaceSession) {
      Alert.alert(t("capture.pdfReplaceTitle"), t("capture.pdfReplaceBody"), [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("capture.uploadPdf"),
          onPress: () => {
            void (async () => {
              try {
                await runUpload();
              } catch {
                Alert.alert(t("capture.pdfFailedTitle"), t("capture.pdfFailedBody"));
              }
            })();
          },
        },
      ]);
      return;
    }

    try {
      await runUpload();
    } catch {
      Alert.alert(t("capture.pdfFailedTitle"), t("capture.pdfFailedBody"));
    }
  };
}
