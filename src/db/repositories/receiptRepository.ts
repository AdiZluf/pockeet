import { eq } from "drizzle-orm";

import { db } from "../client";
import { receiptImages, receipts, type ReceiptStatus } from "../schema";

export type CreateReceiptInput = {
  id: string;
  status: ReceiptStatus;
  currencyCode: string;
  purchasedAt: string;
  userId?: string;
};

export type CreateReceiptImageInput = {
  id: string;
  receiptId: string;
  sortOrder: number;
  localUri: string;
  width?: number;
  height?: number;
};

export async function insertReceipt(input: CreateReceiptInput) {
  const now = new Date().toISOString();
  await db.insert(receipts).values({
    id: input.id,
    userId: input.userId ?? "local",
    status: input.status,
    currencyCode: input.currencyCode,
    purchasedAt: input.purchasedAt,
    createdAt: now,
    updatedAt: now,
  });
}

export async function insertReceiptImages(images: CreateReceiptImageInput[]) {
  if (images.length === 0) return;
  await db.insert(receiptImages).values(
    images.map((img) => ({
      id: img.id,
      receiptId: img.receiptId,
      sortOrder: img.sortOrder,
      localUri: img.localUri,
      width: img.width,
      height: img.height,
      uploadStatus: "pending",
    })),
  );
}

export async function getReceiptWithImages(receiptId: string) {
  const receipt = await db.query.receipts.findFirst({
    where: eq(receipts.id, receiptId),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
    },
  });
  return receipt ?? null;
}

export async function listRecentReceipts(limit = 10) {
  return db.query.receipts.findMany({
    where: (r, { isNull }) => isNull(r.deletedAt),
    orderBy: (r, { desc }) => [desc(r.createdAt)],
    limit,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}
