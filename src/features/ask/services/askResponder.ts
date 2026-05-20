import { categorySeeds } from "@/db/seed/categories";
import {
  getCategoryBreakdownForMonth,
  getMonthReceiptTotals,
  listAllReceipts,
} from "@/db/repositories/receiptRepository";
import { getDefaultCurrency } from "@/db/repositories/preferencesRepository";
import { formatMoney } from "@/utils/money";

import type { AskResponse } from "../types";

const DISPLAY_LOCALE = "en-US";

function normalizeQuestion(text: string) {
  return text.trim().toLowerCase();
}

function categoryName(categoryId: string) {
  const seed = categorySeeds.find((c) => c.id === categoryId);
  return seed?.nameEn ?? categoryId;
}

function response(
  text: string,
  receiptsUsed: number,
  sourceLabel: AskResponse["sourceLabel"],
): AskResponse {
  return { text, receiptsUsed, sourceLabel };
}

async function diningSpendThisMonth(): Promise<AskResponse> {
  const currency = await getDefaultCurrency();
  const now = new Date();
  const monthLabel = now.toLocaleDateString(DISPLAY_LOCALE, { month: "long", year: "numeric" });
  const totals = await getMonthReceiptTotals(now, currency);
  const breakdown = await getCategoryBreakdownForMonth(now, currency);
  const dining = breakdown.find((r) => r.categoryId === "cat_dining");
  if (!dining || dining.amountMinor === 0) {
    return response(
      `I don't see any dining spending in ${monthLabel} yet. Scan a restaurant receipt to track it.`,
      totals.parsedCount,
      "this_month",
    );
  }
  return response(
    `You've spent ${formatMoney(dining.amountMinor, currency)} on dining in ${monthLabel}, based on line items from your saved receipts.`,
    totals.parsedCount,
    "this_month",
  );
}

async function categoryChange(): Promise<AskResponse> {
  const currency = await getDefaultCurrency();
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [currentRows, prevRows, totals] = await Promise.all([
    getCategoryBreakdownForMonth(now, currency),
    getCategoryBreakdownForMonth(prev, currency),
    getMonthReceiptTotals(now, currency),
  ]);

  const currentTotal = currentRows.reduce((s, r) => s + r.amountMinor, 0);
  if (currentTotal === 0) {
    return response(
      "Not enough data this month yet to compare categories.",
      totals.parsedCount,
      "this_month",
    );
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
    return response(
      "No category increased compared to last month based on your saved receipts.",
      totals.parsedCount,
      "this_month",
    );
  }

  const name = categoryName(maxIncrease.categoryId);
  return response(
    `${name} increased the most this month — about ${formatMoney(maxIncrease.delta, currency)} more than last month.`,
    totals.parsedCount,
    "this_month",
  );
}

async function shufersalRecent(): Promise<AskResponse> {
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
    return response(
      "I couldn't find Shufersal receipts in the last 90 days. Try scanning one or check the merchant name on your receipts.",
      0,
      "last_90_days",
    );
  }

  const total = matches.reduce((s, r) => s + (r.totalMinor ?? 0), 0);
  return response(
    `You have ${matches.length} Shufersal receipt${matches.length === 1 ? "" : "s"} in the last 90 days, totaling about ${formatMoney(total, currency)}.`,
    matches.length,
    "last_90_days",
  );
}

async function monthTotal(): Promise<AskResponse> {
  const currency = await getDefaultCurrency();
  const now = new Date();
  const monthLabel = now.toLocaleDateString(DISPLAY_LOCALE, { month: "long", year: "numeric" });
  const totals = await getMonthReceiptTotals(now, currency);
  if (totals.parsedCount === 0) {
    return response(
      `No parsed totals for ${monthLabel} yet. Receipts still analyzing won't appear in spending answers.`,
      0,
      "this_month",
    );
  }
  return response(
    `Your ${monthLabel} spending total is ${formatMoney(totals.totalMinor, currency)} across ${totals.parsedCount} receipt${totals.parsedCount === 1 ? "" : "s"}.`,
    totals.parsedCount,
    "this_month",
  );
}

export async function respondToAskQuestion(question: string): Promise<AskResponse> {
  const q = normalizeQuestion(question);

  if (/500\s*g|meat|price per|unit price|how much.*usually pay/.test(q)) {
    return response(
      "I need more item-level history across receipts to answer unit prices — that's coming soon. For now, try asking about category or merchant totals.",
      0,
      "all_saved",
    );
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

  return response(
    "I can answer questions about category totals, month spending, and merchants like Shufersal based on receipts you've saved. Try one of the suggested questions.",
    0,
    "all_saved",
  );
}
