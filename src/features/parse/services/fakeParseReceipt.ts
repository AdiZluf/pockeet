import { randomUUID } from "expo-crypto";

import {
  applyParsedReceipt,
  getReceiptWithImages,
} from "@/db/repositories/receiptRepository";

const PARSE_DELAY_MS = 2000;

type MockParseTemplate = {
  merchantName: string;
  categoryId: string;
  subtotalMinor: number;
  taxMinor: number;
  lineItems: { name: string; totalMinor: number }[];
};

const MOCK_TEMPLATES: MockParseTemplate[] = [
  {
    merchantName: "Shufersal Deal",
    categoryId: "cat_groceries",
    subtotalMinor: 18990,
    taxMinor: 0,
    lineItems: [
      { name: "Produce", totalMinor: 6200 },
      { name: "Dairy", totalMinor: 4580 },
      { name: "Pantry", totalMinor: 8210 },
    ],
  },
  {
    merchantName: "Café Landwer",
    categoryId: "cat_dining",
    subtotalMinor: 7800,
    taxMinor: 1404,
    lineItems: [
      { name: "Breakfast", totalMinor: 5200 },
      { name: "Coffee", totalMinor: 2600 },
    ],
  },
  {
    merchantName: "Paz Yellow",
    categoryId: "cat_transport",
    subtotalMinor: 24500,
    taxMinor: 0,
    lineItems: [{ name: "Fuel", totalMinor: 24500 }],
  },
  {
    merchantName: "Super-Pharm",
    categoryId: "cat_health",
    subtotalMinor: 8740,
    taxMinor: 0,
    lineItems: [{ name: "Pharmacy", totalMinor: 8740 }],
  },
  {
    merchantName: "IKEA",
    categoryId: "cat_household",
    subtotalMinor: 31200,
    taxMinor: 0,
    lineItems: [{ name: "Home goods", totalMinor: 31200 }],
  },
  {
    merchantName: "AM:PM",
    categoryId: "cat_groceries",
    subtotalMinor: 4290,
    taxMinor: 771,
    lineItems: [
      { name: "Snacks", totalMinor: 1890 },
      { name: "Drinks", totalMinor: 2400 },
    ],
  },
];

const inFlight = new Map<string, Promise<void>>();

function pickTemplate(receiptId: string): MockParseTemplate {
  let hash = 0;
  for (let i = 0; i < receiptId.length; i++) {
    hash = (hash + receiptId.charCodeAt(i)) % MOCK_TEMPLATES.length;
  }
  return MOCK_TEMPLATES[hash]!;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function doFakeParse(receiptId: string): Promise<void> {
  const receipt = await getReceiptWithImages(receiptId);
  if (!receipt || receipt.status !== "processing") return;

  await delay(PARSE_DELAY_MS);

  const current = await getReceiptWithImages(receiptId);
  if (!current || current.status !== "processing") return;

  const template = pickTemplate(receiptId);
  const totalMinor = template.subtotalMinor + template.taxMinor;
  const purchasedAt = current.purchasedAt ?? new Date().toISOString();

  await applyParsedReceipt({
    receiptId,
    merchantName: template.merchantName,
    purchasedAt,
    currencyCode: current.currencyCode,
    subtotalMinor: template.subtotalMinor,
    taxMinor: template.taxMinor,
    totalMinor,
    defaultCategoryId: template.categoryId,
    confidence: 85,
    lineItems: template.lineItems.map((item) => ({
      id: randomUUID(),
      name: item.name,
      totalMinor: item.totalMinor,
      categoryId: template.categoryId,
    })),
  });
}

/** Local-only mock parse: ~2s delay, then writes parsed fields and moves to needs_review. */
export function runFakeParse(receiptId: string): Promise<void> {
  const existing = inFlight.get(receiptId);
  if (existing) return existing;

  const promise = doFakeParse(receiptId).finally(() => {
    inFlight.delete(receiptId);
  });
  inFlight.set(receiptId, promise);
  return promise;
}

export const FAKE_PARSE_DELAY_MS = PARSE_DELAY_MS;
