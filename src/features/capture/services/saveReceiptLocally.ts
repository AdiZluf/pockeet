import * as FileSystem from "expo-file-system/legacy";
import { randomUUID } from "expo-crypto";

import { insertReceipt, insertReceiptImages } from "@/db/repositories/receiptRepository";
import { runFakeParse } from "@/features/parse/services/fakeParseReceipt";

import { LOCAL_USER_ID } from "../constants";
import type { CaptureSessionImage } from "../types";
import { receiptStorageDir } from "./receiptStorage";

export async function saveReceiptLocally(
  images: CaptureSessionImage[],
  currencyCode: string,
): Promise<string> {
  if (images.length === 0) {
    throw new Error("At least one receipt image is required");
  }

  const receiptId = randomUUID();
  const dir = receiptStorageDir(receiptId);
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const purchasedAt = new Date().toISOString();
  const imageRows = [];

  for (let i = 0; i < images.length; i++) {
    const source = images[i];
    const dest = `${dir}page-${i}.jpg`;
    await FileSystem.copyAsync({ from: source.uri, to: dest });

    imageRows.push({
      id: randomUUID(),
      receiptId,
      sortOrder: i,
      localUri: dest,
      width: source.width,
      height: source.height,
    });
  }

  await insertReceipt({
    id: receiptId,
    status: "processing",
    currencyCode,
    purchasedAt,
    userId: LOCAL_USER_ID,
  });
  await insertReceiptImages(imageRows);

  void runFakeParse(receiptId);

  return receiptId;
}
