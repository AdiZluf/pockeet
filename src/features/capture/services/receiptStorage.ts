import * as FileSystem from "expo-file-system/legacy";

export function receiptStorageDir(receiptId: string) {
  const base = FileSystem.documentDirectory;
  if (!base) throw new Error("Document directory is unavailable");
  return `${base}receipts/${receiptId}/`;
}

export function sanitizeReceiptFileName(name: string) {
  const trimmed = name.trim() || "receipt.pdf";
  const base = trimmed.replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}
