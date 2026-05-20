import { randomUUID } from "expo-crypto";

import type { getReceiptWithImages } from "@/db/repositories/receiptRepository";

import type { ReviewFormDraft, ReviewLineItemDraft } from "../types";
import { toDateInputValue } from "../services/reviewValidation";

type ReceiptForReview = NonNullable<Awaited<ReturnType<typeof getReceiptWithImages>>>;

function minorToInput(minor: number | null | undefined): string {
  if (minor == null) return "";
  return (minor / 100).toFixed(2);
}

export function buildReviewFormFromReceipt(receipt: ReceiptForReview): ReviewFormDraft {
  const lineItems: ReviewLineItemDraft[] =
    receipt.lineItems.length > 0
      ? receipt.lineItems.map((item) => ({
          id: item.id,
          name: item.name,
          amountInput: minorToInput(item.totalMinor),
        }))
      : [{ id: randomUUID(), name: "", amountInput: "" }];

  return {
    merchantName: receipt.merchantName ?? "",
    dateValue: toDateInputValue(receipt.purchasedAt ?? receipt.createdAt),
    totalInput: minorToInput(receipt.totalMinor),
    categoryId: receipt.defaultCategoryId ?? null,
    lineItems,
  };
}
