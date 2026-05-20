import { categorySeeds } from "@/db/seed/categories";
import {
  getCategoryBreakdownForMonth,
  getMonthReceiptTotals,
  listAllReceipts,
} from "@/db/repositories/receiptRepository";
import { getDefaultCurrency } from "@/db/repositories/preferencesRepository";
import { formatMoney } from "@/utils/money";

const DISPLAY_LOCALE = "en-US";

function normalizeQuestion(text: string) {
  return text.trim().toLowerCase();
}

function categoryName(categoryId: string) {
  const seed = categorySeeds.find((c) => c.id === categoryId);
  return seed?.nameEn ?? categoryId;
}

async function diningSpendThisMonth(): Promise<string> {
  const currency = await getDefaultCurrency();
  const now = new Date();
  const monthLabel = now.toLocaleDateString(DISPLAY_LOCALE, { month: "long", year: "numeric" });
  const breakdown = await getCategoryBreakdownForMonth(now, currency);
  const dining = breakdown.find((r) => r.categoryId === "cat_dining");
  if (!dining || dining.amountMinor === 0) {
    return `I don't see any dining spending in ${monthLabel} yet. Scan a restaurant receipt to track it.`;
  }
  return `You've spent ${formatMoney(dining.amountMinor, currency)} on dining in ${monthLabel} (from saved receipt line items).`;
}

async function categoryChange(): Promise<string> {
  const currency = await getDefaultCurrency();
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [currentRows, prevRows] = await Promise.all([
    getCategoryBreakdownForMonth(now, currency),
    getCategoryBreakdownForMonth(prev, currency),
  ]);

  const currentTotal = currentRows.reduce((s, r) => s + r.amountMinor, 0);
  if (currentTotal === 0) {
    return "Not enough data this month yet to compare categories.";
  }

  let maxIncrease = { categoryId: "", delta: 0 };
  for (const row of currentRows) {
    const prevAmount =
      prevRows.find((p) => p.categoryId === row.categoryId)?.amountMinor ?? 0;
    const delta = row.amountMinor - prevAmount;
    if (delta > maxIncrease.delta) {
      maxIncrease = { categoryId: row.categoryId, delta };
    }
  }

  if (maxIncrease.delta <= 0) {
    return "No category increased compared to last month based on your saved receipts.";
  }

  const name = categoryName(maxIncrease.categoryId);
  return `${name} increased the most this month — about ${formatMoney(maxIncrease.delta, currency)} more than last month.`;
}

async function shufersalRecent(): Promise<string> {
  const currency = await getDefaultCurrency();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const all = await listAllReceipts();
  const matches = all.filter(
    (r) =>
      r.merchantName?.toLowerCase().includes("shufersal") &&
      r.totalMinor != null &&
      r.purchasedAt &&
      new Date(r.purchasedAt) >= cutoff,
  );

  if (matches.length === 0) {
    return "I couldn't find Shufersal receipts in the last 90 days. Try scanning one or check the merchant name on your receipts.";
  }

  const total = matches.reduce((s, r) => s + (r.totalMinor ?? 0), 0);
  return `You have ${matches.length} Shufersal receipt${matches.length === 1 ? "" : "s"} in the last 90 days, totaling about ${formatMoney(total, currency)}.`;
}

async function monthTotal(): Promise<string> {
  const currency = await getDefaultCurrency();
  const now = new Date();
  const monthLabel = now.toLocaleDateString(DISPLAY_LOCALE, { month: "long", year: "numeric" });
  const totals = await getMonthReceiptTotals(now, currency);
  if (totals.parsedCount === 0) {
    return `No parsed totals for ${monthLabel} yet. Receipts still analyzing won't appear in spending answers.`;
  }
  return `Your ${monthLabel} spending total is ${formatMoney(totals.totalMinor, currency)} across ${totals.parsedCount} receipt${totals.parsedCount === 1 ? "" : "s"}.`;
}

export async function respondToAskQuestion(question: string): Promise<string> {
  const q = normalizeQuestion(question);

  if (/500\s*g|meat|price per|unit price|how much.*usually pay/.test(q)) {
    return "I need more item-level history across receipts to answer unit prices — that's coming soon. For now, try asking about category or merchant totals.";
  }

  if (/shufersal|שופרסל/.test(q)) {
    return shufersalRecent();
  }

  if (/restaurant|dining|eat out|food out/.test(q)) {
    return diningSpendThisMonth();
  }

  if (/increas|most|compare|category|categories/.test(q)) {
    return categoryChange();
  }

  if (/this month|month total|spend.*month|how much.*month/.test(q)) {
    return monthTotal();
  }

  if (/average|avg|usually/.test(q) && /restaurant|dining/.test(q)) {
    return diningSpendThisMonth();
  }

  return "I can answer questions about category totals, month spending, and merchants like Shufersal based on receipts you've saved. Try one of the suggested questions.";
}
