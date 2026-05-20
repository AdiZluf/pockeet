import type { TFunction } from "i18next";

import { categorySeeds } from "@/db/seed/categories";
import type { ReceiptFilters } from "@/db/receiptFilters";
import { dateFromMonthKey } from "./filterParams";

const DISPLAY_LOCALE = "en-US";

export function formatMonthChipLabel(monthKey: string): string {
  const date = dateFromMonthKey(monthKey);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear()).slice(-2);
  return `${m}/${y}`;
}

export function filtersSubtitle(filters: ReceiptFilters, t: TFunction): string {
  const parts: string[] = [];
  if (filters.month) {
    parts.push(formatMonthChipLabel(filters.month));
  } else if (filters.from || filters.to) {
    parts.push(t("receipts.filters.dateRange"));
  }
  if (filters.categories.length > 0) {
    parts.push(t("receipts.filters.categoryCount", { count: filters.categories.length }));
  }
  if (filters.status !== "all") {
    parts.push(t(`receipts.filters.status.${filters.status}`));
  }
  if (parts.length === 0) return t("receipts.subtitle");
  return parts.join(" · ");
}

export function categoryLabel(categoryId: string): string {
  return categorySeeds.find((c) => c.id === categoryId)?.nameEn ?? categoryId;
}

export type FilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

export function buildFilterChips(
  filters: ReceiptFilters,
  t: TFunction,
  onChange: (next: ReceiptFilters) => void,
): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.month) {
    chips.push({
      id: "month",
      label: formatMonthChipLabel(filters.month),
      onRemove: () => onChange({ ...filters, month: undefined }),
    });
  } else if (filters.from || filters.to) {
    chips.push({
      id: "range",
      label: t("receipts.filters.dateRange"),
      onRemove: () => onChange({ ...filters, from: undefined, to: undefined }),
    });
  }

  for (const categoryId of filters.categories) {
    chips.push({
      id: `cat-${categoryId}`,
      label: categoryLabel(categoryId),
      onRemove: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== categoryId),
        }),
    });
  }

  if (filters.status !== "all") {
    chips.push({
      id: "status",
      label: t(`receipts.filters.status.${filters.status}`),
      onRemove: () => onChange({ ...filters, status: "all" }),
    });
  }

  return chips;
}
