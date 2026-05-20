import { categorySeeds } from "@/db/seed/categories";
import {
  getCategoryBreakdownForMonth,
  listMonthReadyReceipts,
} from "@/db/repositories/receiptRepository";
import { getDefaultCurrency } from "@/db/repositories/preferencesRepository";
import { formatMoney } from "@/utils/money";

export type HomeInsight = {
  id: string;
  icon: "trending-up" | "trending-down" | "storefront" | "cart" | "nutrition";
  message: string;
};

const MEAT_PATTERN = /\b(meat|beef|chicken|steak|turkey|lamb|בשר|עוף)\b/i;

function categoryLabel(categoryId: string) {
  return categorySeeds.find((c) => c.id === categoryId)?.nameEn.toLowerCase() ?? "spending";
}

export async function loadHomeInsights(referenceDate = new Date()): Promise<HomeInsight[]> {
  const currency = await getDefaultCurrency();
  const now = referenceDate;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [currentBreakdown, prevBreakdown, receipts] = await Promise.all([
    getCategoryBreakdownForMonth(now, currency),
    getCategoryBreakdownForMonth(prev, currency),
    listMonthReadyReceipts(now, currency),
  ]);

  if (receipts.length === 0) return [];

  const insights: HomeInsight[] = [];

  // Category % change vs last month (pick largest meaningful swing)
  let bestSwing: { categoryId: string; pct: number } | null = null;
  for (const row of currentBreakdown) {
    const prevAmount =
      prevBreakdown.find((p) => p.categoryId === row.categoryId)?.amountMinor ?? 0;
    if (prevAmount <= 0 || row.amountMinor <= 0) continue;
    const pct = Math.round(((row.amountMinor - prevAmount) / prevAmount) * 100);
    if (!bestSwing || Math.abs(pct) > Math.abs(bestSwing.pct)) {
      bestSwing = { categoryId: row.categoryId, pct };
    }
  }

  if (bestSwing && Math.abs(bestSwing.pct) >= 8) {
    const label = categoryLabel(bestSwing.categoryId);
    insights.push({
      id: `cat-swing-${bestSwing.categoryId}`,
      icon: bestSwing.pct > 0 ? "trending-up" : "trending-down",
      message:
        bestSwing.pct > 0
          ? `You spent ${bestSwing.pct}% more on ${label} this month`
          : `You spent ${Math.abs(bestSwing.pct)}% less on ${label} this month`,
    });
  }

  // Top merchant by visit count
  const merchantCounts = new Map<string, number>();
  for (const r of receipts) {
    const name = r.merchantName?.trim();
    if (!name) continue;
    merchantCounts.set(name, (merchantCounts.get(name) ?? 0) + 1);
  }
  let topMerchant: { name: string; count: number } | null = null;
  for (const [name, count] of merchantCounts) {
    if (!topMerchant || count > topMerchant.count) {
      topMerchant = { name, count };
    }
  }
  if (topMerchant && topMerchant.count >= 2) {
    insights.push({
      id: "top-merchant",
      icon: "storefront",
      message: `Most visited merchant this month: ${topMerchant.name}`,
    });
  }

  // Average grocery basket
  const groceries = receipts.filter((r) => r.defaultCategoryId === "cat_groceries");
  if (groceries.length >= 2) {
    const avg =
      groceries.reduce((s, r) => s + (r.totalMinor ?? 0), 0) / groceries.length;
    insights.push({
      id: "grocery-avg",
      icon: "cart",
      message: `Average grocery basket: ${formatMoney(Math.round(avg), currency)}`,
    });
  }

  // Meat line-item frequency
  let meatCount = 0;
  for (const r of receipts) {
    for (const item of r.lineItems) {
      if (MEAT_PATTERN.test(item.name)) {
        meatCount += 1;
        break;
      }
    }
  }
  if (meatCount >= 2) {
    insights.push({
      id: "meat-freq",
      icon: "nutrition",
      message: `You bought meat on ${meatCount} receipt${meatCount === 1 ? "" : "s"} this month`,
    });
  }

  return insights.slice(0, 3);
}
