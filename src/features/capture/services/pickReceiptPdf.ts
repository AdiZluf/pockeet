import * as DocumentPicker from "expo-document-picker";

export type PickedReceiptPdf = {
  uri: string;
  name: string;
};

export async function pickReceiptPdf(): Promise<PickedReceiptPdf | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  if (!asset.uri) return null;

  const mime = asset.mimeType?.toLowerCase();
  const name = asset.name ?? "receipt.pdf";
  if (mime && mime !== "application/pdf" && !name.toLowerCase().endsWith(".pdf")) {
    return null;
  }

  return { uri: asset.uri, name };
}
