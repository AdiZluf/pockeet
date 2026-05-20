import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { getDefaultCurrency } from "@/db/repositories/preferencesRepository";

import { pickReceiptPdfWithFeedback } from "../services/pickReceiptPdf";
import { savePdfReceiptLocally } from "../services/savePdfReceiptLocally";
import { useCaptureSessionStore } from "../stores/captureSessionStore";

type UploadPdfOptions = {
  /** When true, confirm discarding an in-progress photo session before upload. */
  replaceSession?: boolean;
};

export function useUploadReceiptPdf() {
  const { t } = useTranslation();
  const router = useRouter();
  const reset = useCaptureSessionStore((s) => s.reset);

  const runUpload = async () => {
    const pick = await pickReceiptPdfWithFeedback(t);
    if (pick.status === "canceled") return;
    if (pick.status === "invalid" || pick.status === "error") {
      return;
    }

    try {
      const currencyCode = await getDefaultCurrency();
      const receiptId = await savePdfReceiptLocally(
        pick.file.uri,
        pick.file.name,
        currencyCode,
      );
      reset();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.replace(`/receipt/${receiptId}/processing`);
    } catch {
      Alert.alert(t("capture.pdfFailedTitle"), t("capture.pdfFailedBody"));
    }
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
            void runUpload();
          },
        },
      ]);
      return;
    }

    await runUpload();
  };
}
