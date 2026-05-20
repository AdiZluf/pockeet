import { Asset } from "expo-asset";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";

import {
  clearDemoReceipts,
  countDemoReceipts,
  insertLineItems,
  insertReceipt,
  insertReceiptImages,
} from "@/db/repositories/receiptRepository";

const DEMO_USER_ID = "demo";

type DemoReceiptSeed = {
  merchantName: string;
  status: "ready" | "needs_review" | "processing" | "failed";
  purchasedAt: string;
  currencyCode: string;
  totalMinor?: number;
  subtotalMinor?: number;
  taxMinor?: number;
  categoryId?: string;
  lineItems?: { name: string; totalMinor: number; categoryId: string }[];
};

const demoReceipts: DemoReceiptSeed[] = [
  {
    merchantName: "Shufersal Deal",
    status: "ready",
    purchasedAt: daysAgo(2),
    currencyCode: "ILS",
    subtotalMinor: 18990,
    taxMinor: 0,
    totalMinor: 18990,
    categoryId: "cat_groceries",
    lineItems: [
      { name: "Produce", totalMinor: 6200, categoryId: "cat_groceries" },
      { name: "Dairy", totalMinor: 4580, categoryId: "cat_groceries" },
      { name: "Pantry", totalMinor: 8210, categoryId: "cat_groceries" },
    ],
  },
  {
    merchantName: "Café Landwer",
    status: "needs_review",
    purchasedAt: daysAgo(4),
    currencyCode: "ILS",
    subtotalMinor: 7800,
    taxMinor: 1404,
    totalMinor: 9204,
    categoryId: "cat_dining",
    lineItems: [
      { name: "Breakfast", totalMinor: 5200, categoryId: "cat_dining" },
      { name: "Coffee", totalMinor: 2600, categoryId: "cat_dining" },
    ],
  },
  {
    merchantName: "Paz Yellow",
    status: "ready",
    purchasedAt: daysAgo(6),
    currencyCode: "ILS",
    totalMinor: 24500,
    categoryId: "cat_transport",
    lineItems: [{ name: "Fuel", totalMinor: 24500, categoryId: "cat_transport" }],
  },
  {
    merchantName: "IKEA",
    status: "ready",
    purchasedAt: daysAgo(12),
    currencyCode: "ILS",
    totalMinor: 31200,
    categoryId: "cat_household",
    lineItems: [{ name: "Home goods", totalMinor: 31200, categoryId: "cat_household" }],
  },
  {
    merchantName: "Super-Pharm",
    status: "ready",
    purchasedAt: daysAgo(18),
    currencyCode: "ILS",
    totalMinor: 8740,
    categoryId: "cat_health",
    lineItems: [{ name: "Pharmacy", totalMinor: 8740, categoryId: "cat_health" }],
  },
  {
    merchantName: "Wolt Market",
    status: "processing",
    purchasedAt: daysAgo(0),
    currencyCode: "ILS",
  },
  {
    merchantName: "AM:PM",
    status: "failed",
    purchasedAt: daysAgo(1),
    currencyCode: "ILS",
  },
  {
    merchantName: "Steimatzky",
    status: "ready",
    purchasedAt: daysAgo(35),
    currencyCode: "ILS",
    totalMinor: 12900,
    categoryId: "cat_shopping",
    lineItems: [{ name: "Books", totalMinor: 12900, categoryId: "cat_shopping" }],
  },
  {
    merchantName: "Amazon.com",
    status: "ready",
    purchasedAt: daysAgo(3),
    currencyCode: "USD",
    totalMinor: 4599,
    categoryId: "cat_shopping",
    lineItems: [{ name: "Online order", totalMinor: 4599, categoryId: "cat_shopping" }],
  },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

async function ensureDemoPlaceholderUri() {
  const dir = `${FileSystem.documentDirectory}demo/`;
  const dest = `${dir}placeholder.jpg`;
  const info = await FileSystem.getInfoAsync(dest);
  if (info.exists) return dest;

  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const asset = Asset.fromModule(require("../../../assets/images/icon.png"));
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error("Demo placeholder asset unavailable");
  await FileSystem.copyAsync({ from: asset.localUri, to: dest });
  return dest;
}

export async function seedDemoData(): Promise<{ inserted: number; skipped: boolean }> {
  if (!__DEV__) {
    return { inserted: 0, skipped: true };
  }

  const existing = await countDemoReceipts();
  if (existing > 0) {
    return { inserted: 0, skipped: true };
  }

  const placeholderUri = await ensureDemoPlaceholderUri();
  let inserted = 0;

  for (const seed of demoReceipts) {
    const receiptId = randomUUID();
    await insertReceipt({
      id: receiptId,
      userId: DEMO_USER_ID,
      status: seed.status,
      currencyCode: seed.currencyCode,
      purchasedAt: seed.purchasedAt,
      merchantName: seed.merchantName,
      totalMinor: seed.totalMinor,
      subtotalMinor: seed.subtotalMinor,
      taxMinor: seed.taxMinor,
      defaultCategoryId: seed.categoryId,
    });

    await insertReceiptImages([
      {
        id: randomUUID(),
        receiptId,
        sortOrder: 0,
        localUri: placeholderUri,
        width: 512,
        height: 512,
      },
    ]);

    if (seed.lineItems?.length) {
      await insertLineItems(
        seed.lineItems.map((item, index) => ({
          id: randomUUID(),
          receiptId,
          sortOrder: index,
          name: item.name,
          totalMinor: item.totalMinor,
          categoryId: item.categoryId,
        })),
      );
    }

    inserted += 1;
  }

  return { inserted, skipped: false };
}

export async function resetDemoData(): Promise<void> {
  if (!__DEV__) return;
  await clearDemoReceipts();
}
