import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import type { TFunction } from "i18next";

export type PickedReceiptPdf = {
  uri: string;
  name: string;
};

export type PickPdfResult =
  | { status: "picked"; file: PickedReceiptPdf }
  | { status: "canceled" }
  | { status: "invalid" }
  | { status: "error"; message: string };

export async function pickReceiptPdfWithFeedback(t: TFunction): Promise<PickPdfResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets?.length) {
      return { status: "canceled" };
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      return { status: "error", message: "missing_uri" };
    }

    const mime = asset.mimeType?.toLowerCase();
    const name = asset.name ?? "receipt.pdf";
    if (mime && mime !== "application/pdf" && !name.toLowerCase().endsWith(".pdf")) {
      Alert.alert(t("addReceipt.pdfInvalidTitle"), t("addReceipt.pdfInvalidBody"));
      return { status: "invalid" };
    }

    return { status: "picked", file: { uri: asset.uri, name } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    Alert.alert(t("capture.pdfFailedTitle"), t("capture.pdfFailedBody"));
    return { status: "error", message };
  }
}

/** @deprecated Use pickReceiptPdfWithFeedback — kept for capture preview inline upload */
export async function pickReceiptPdf(): Promise<PickedReceiptPdf | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0];
  if (!asset.uri) return null;

  const name = asset.name ?? "receipt.pdf";
  return { uri: asset.uri, name };
}
