import type { ReceiptStatus } from "./schema";

export type ReceiptStatusFilter =
  | "all"
  | "processing"
  | "needs_review"
  | "ready"
  | "failed";

export type ReceiptFilters = {
  month?: string;
  from?: string;
  to?: string;
  categories: string[];
  status: ReceiptStatusFilter;
};

export const DEFAULT_RECEIPT_FILTERS: ReceiptFilters = {
  categories: [],
  status: "all",
};

export const STATUS_FILTER_STATUSES: Record<
  Exclude<ReceiptStatusFilter, "all">,
  ReceiptStatus[]
> = {
  processing: ["draft", "processing"],
  needs_review: ["needs_review"],
  ready: ["ready"],
  failed: ["failed"],
};
