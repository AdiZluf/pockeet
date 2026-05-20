import type { ReceiptStatus } from "@/db/schema";
import type { ReceiptStatusVariant } from "@/components/ui";

export function receiptStatusVariant(status: ReceiptStatus): ReceiptStatusVariant {
  if (status === "needs_review") return "review";
  if (status === "ready") return "ready";
  if (status === "failed") return "failed";
  return "processing";
}

export function receiptStatusI18nKey(status: ReceiptStatus) {
  return `status.${status}` as const;
}

export function formatReceiptDate(iso: string | null | undefined, locale: string) {
  const date = iso ? new Date(iso) : new Date();
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatReceiptMonth(iso: string | null | undefined, locale: string) {
  const date = iso ? new Date(iso) : new Date();
  return date.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}

export function monthBucketKey(iso: string | null | undefined) {
  const date = iso ? new Date(iso) : new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function isParsedReceipt(status: ReceiptStatus, totalMinor: number | null | undefined) {
  return (status === "ready" || status === "needs_review") && totalMinor != null;
}
