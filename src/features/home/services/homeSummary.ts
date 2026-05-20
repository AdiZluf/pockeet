import { categorySeeds } from "@/db/seed/categories";
import {
  getCategoryBreakdownForMonth,
  getMonthReceiptTotals,
  listRecentReceipts,
  listReceiptsByStatus,
} from "@/db/repositories/receiptRepository";
import type { ReceiptStatus } from "@/db/schema";

export type ReceiptSummaryRow = {
  id: string;
  status: ReceiptStatus;
  merchantName: string | null;
  purchasedAt: string | null;
  createdAt: string;
  totalMinor: number | null;
  currencyCode: string;
  thumbUri: string | null;
  imageCount: number;
};

export type CategoryBreakdownRow = {
  categoryId: string;
  name: string;
  amountMinor: number;
  percent: number;
};

export type HomeSummary = {
  monthLabel: string;
  totalMinor: number;
  currencyCode: string;
  hasParsedTotals: boolean;
  receiptCount: number;
  isEmpty: boolean;
  needsReview: ReceiptSummaryRow[];
  processing: ReceiptSummaryRow[];
  recent: ReceiptSummaryRow[];
  categories: CategoryBreakdownRow[];
};

function toRow(
  receipt: Awaited<ReturnType<typeof listRecentReceipts>>[number],
): ReceiptSummaryRow {
  return {
    id: receipt.id,
    status: receipt.status,
    merchantName: receipt.merchantName,
    purchasedAt: receipt.purchasedAt,
    createdAt: receipt.createdAt,
    totalMinor: receipt.totalMinor,
    currencyCode: receipt.currencyCode,
    thumbUri: receipt.images[0]?.localUri ?? null,
    imageCount: receipt.images.length,
  };
}

function categoryName(categoryId: string) {
  const seed = categorySeeds.find((c) => c.id === categoryId);
  if (!seed) return categoryId;
  return seed.nameEn;
}

const DISPLAY_LOCALE = "en-US";

export async function loadHomeSummary(referenceDate = new Date()): Promise<HomeSummary> {
  const monthLabel = referenceDate.toLocaleDateString(DISPLAY_LOCALE, {
    month: "long",
    year: "numeric",
  });

  const [monthTotals, needsReview, processing, recent, breakdown] = await Promise.all([
    getMonthReceiptTotals(referenceDate),
    listReceiptsByStatus(["needs_review"], 5),
    listReceiptsByStatus(["processing", "draft"], 5),
    listRecentReceipts(5),
    getCategoryBreakdownForMonth(referenceDate),
  ]);

  const totalMinor = monthTotals.totalMinor;
  const hasParsedTotals = monthTotals.parsedCount > 0;

  let categories: CategoryBreakdownRow[] = [];

  if (breakdown.length > 0 && totalMinor > 0) {
    categories = breakdown
      .map((row) => ({
        categoryId: row.categoryId,
        name: categoryName(row.categoryId),
        amountMinor: row.amountMinor,
        percent: Math.round((row.amountMinor / totalMinor) * 100),
      }))
      .sort((a, b) => b.amountMinor - a.amountMinor)
      .slice(0, 5);
  }

  const needsReviewRows = needsReview.map(toRow);
  const processingRows = processing.map(toRow);
  const recentRows = recent.map(toRow);
  const isEmpty =
    monthTotals.receiptCount === 0 &&
    needsReviewRows.length === 0 &&
    processingRows.length === 0 &&
    recentRows.length === 0;

  return {
    monthLabel,
    totalMinor,
    currencyCode: monthTotals.currencyCode,
    hasParsedTotals,
    receiptCount: monthTotals.receiptCount,
    isEmpty,
    needsReview: needsReviewRows,
    processing: processingRows,
    recent: recentRows,
    categories,
  };
}
