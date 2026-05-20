import {
  updateReceiptFromReview,
  type UpdateReceiptReviewInput,
} from "@/db/repositories/receiptRepository";
import type { ReceiptStatus } from "@/db/schema";

import type { ReviewFormDraft } from "../types";
import { parseDateInput, validateReviewForm } from "./reviewValidation";
import { parseMoneyInput } from "@/utils/money";

export type SaveReviewResult =
  | { ok: true }
  | { ok: false; errors: ReturnType<typeof validateReviewForm>["errors"] };

export function validateForSave(form: ReviewFormDraft) {
  return validateReviewForm(
    form.merchantName,
    form.dateValue,
    form.totalInput,
    form.lineItems,
  );
}

export async function saveReceiptReview(
  receiptId: string,
  currencyCode: string,
  form: ReviewFormDraft,
  status: Extract<ReceiptStatus, "ready" | "needs_review">,
): Promise<SaveReviewResult> {
  const validation = validateForSave(form);
  if (!validation.ok || validation.parsedTotalMinor == null) {
    return { ok: false, errors: validation.errors };
  }

  const purchasedAt = parseDateInput(form.dateValue);
  if (!purchasedAt) {
    return { ok: false, errors: { date: "invalid" } };
  }

  const filledLineItems = form.lineItems
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      totalMinor: parseMoneyInput(item.amountInput),
    }))
    .filter((item) => item.name && item.totalMinor != null && item.totalMinor > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      totalMinor: item.totalMinor as number,
      categoryId: form.categoryId ?? undefined,
    }));

  const payload: UpdateReceiptReviewInput = {
    receiptId,
    merchantName: form.merchantName.trim(),
    purchasedAt,
    totalMinor: validation.parsedTotalMinor,
    defaultCategoryId: form.categoryId,
    status,
    lineItems: filledLineItems,
  };

  await updateReceiptFromReview(payload);
  return { ok: true };
}
