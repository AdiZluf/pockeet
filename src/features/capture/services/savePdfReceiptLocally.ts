import * as FileSystem from "expo-file-system/legacy";
import { randomUUID } from "expo-crypto";

import { insertReceipt, insertReceiptImages } from "@/db/repositories/receiptRepository";
import { runFakeParse } from "@/features/parse/services/fakeParseReceipt";

import { LOCAL_USER_ID } from "../constants";
import { receiptStorageDir, sanitizeReceiptFileName } from "./receiptStorage";

export async function savePdfReceiptLocally(
  sourceUri: string,
  fileName: string,
  currencyCode: string,
): Promise<string> {
  const receiptId = randomUUID();
  const dir = receiptStorageDir(receiptId);
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const dest = `${dir}${sanitizeReceiptFileName(fileName)}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });

  const purchasedAt = new Date().toISOString();

  await insertReceipt({
    id: receiptId,
    status: "processing",
    currencyCode,
    purchasedAt,
    userId: LOCAL_USER_ID,
  });
  await insertReceiptImages([
    {
      id: randomUUID(),
      receiptId,
      sortOrder: 0,
      localUri: dest,
    },
  ]);

  void runFakeParse(receiptId);

  return receiptId;
}
