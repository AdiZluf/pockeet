import {
  DEFAULT_RECEIPT_FILTERS,
  type ReceiptFilters,
  type ReceiptStatusFilter,
} from "@/db/receiptFilters";

const STATUS_VALUES: ReceiptStatusFilter[] = [
  "all",
  "processing",
  "needs_review",
  "ready",
  "failed",
];

function parseStatus(value: string | undefined): ReceiptStatusFilter {
  if (value && STATUS_VALUES.includes(value as ReceiptStatusFilter)) {
    return value as ReceiptStatusFilter;
  }
  return "all";
}

export function filtersFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): ReceiptFilters {
  const month = typeof params.month === "string" ? params.month : undefined;
  const from = typeof params.from === "string" ? params.from : undefined;
  const to = typeof params.to === "string" ? params.to : undefined;
  const status = parseStatus(typeof params.status === "string" ? params.status : undefined);

  let categories: string[] = [];
  const rawCategories = params.categories;
  if (typeof rawCategories === "string" && rawCategories.length > 0) {
    categories = rawCategories.split(",").filter(Boolean);
  }

  return { month, from, to, categories, status };
}

export function filtersToSearchParams(filters: ReceiptFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.month) params.month = filters.month;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.status !== "all") params.status = filters.status;
  if (filters.categories.length > 0) params.categories = filters.categories.join(",");
  return params;
}

export function countActiveFilters(filters: ReceiptFilters): number {
  let count = 0;
  if (filters.month || filters.from || filters.to) count += 1;
  if (filters.categories.length > 0) count += 1;
  if (filters.status !== "all") count += 1;
  return count;
}

export function isDefaultFilters(filters: ReceiptFilters): boolean {
  return (
    !filters.month &&
    !filters.from &&
    !filters.to &&
    filters.categories.length === 0 &&
    filters.status === DEFAULT_RECEIPT_FILTERS.status
  );
}

export function monthKeyFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function dateFromMonthKey(monthKey: string): Date {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1);
}
