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
  needsReview: ReceiptSummaryRow[];
  processing: ReceiptSummaryRow[];
  recent: ReceiptSummaryRow[];
  categories: CategoryBreakdownRow[];
  usesMockCategories: boolean;
};

const MOCK_CATEGORY_SHARES = [
  { categoryId: "cat_groceries", percent: 38 },
  { categoryId: "cat_dining", percent: 24 },
  { categoryId: "cat_transport", percent: 18 },
  { categoryId: "cat_household", percent: 12 },
  { categoryId: "cat_other", percent: 8 },
];

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

function categoryName(categoryId: string, locale: string) {
  const seed = categorySeeds.find((c) => c.id === categoryId);
  if (!seed) return categoryId;
  return locale.startsWith("he") ? seed.nameHe : seed.nameEn;
}

function buildMockCategories(totalMinor: number, locale: string): CategoryBreakdownRow[] {
  return MOCK_CATEGORY_SHARES.map((share) => ({
    categoryId: share.categoryId,
    name: categoryName(share.categoryId, locale),
    amountMinor: Math.round((totalMinor * share.percent) / 100),
    percent: share.percent,
  }));
}

export async function loadHomeSummary(locale: string, referenceDate = new Date()): Promise<HomeSummary> {
  const monthLabel = referenceDate.toLocaleDateString(locale, { month: "long", year: "numeric" });

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
  let usesMockCategories = false;

  if (breakdown.length >= 2 && totalMinor > 0) {
    categories = breakdown
      .map((row) => ({
        categoryId: row.categoryId,
        name: categoryName(row.categoryId, locale),
        amountMinor: row.amountMinor,
        percent: Math.round((row.amountMinor / totalMinor) * 100),
      }))
      .sort((a, b) => b.amountMinor - a.amountMinor)
      .slice(0, 5);
  } else if (totalMinor > 0) {
    categories = buildMockCategories(totalMinor, locale);
    usesMockCategories = true;
  } else if (hasParsedTotals === false) {
    categories = buildMockCategories(42000, locale);
    usesMockCategories = true;
  }

  return {
    monthLabel,
    totalMinor,
    currencyCode: monthTotals.currencyCode,
    hasParsedTotals,
    needsReview: needsReview.map(toRow),
    processing: processing.map(toRow),
    recent: recent.map(toRow),
    categories,
    usesMockCategories,
  };
}
