import { and, desc, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { randomUUID } from "expo-crypto";

import { db } from "../client";
import { lineItems, receiptImages, receipts, type ReceiptStatus } from "../schema";

export type CreateReceiptInput = {
  id: string;
  status: ReceiptStatus;
  currencyCode: string;
  purchasedAt: string;
  userId?: string;
  merchantName?: string;
  totalMinor?: number;
  subtotalMinor?: number;
  taxMinor?: number;
  defaultCategoryId?: string;
};

export type CreateReceiptImageInput = {
  id: string;
  receiptId: string;
  sortOrder: number;
  localUri: string;
  width?: number;
  height?: number;
};

export type CreateLineItemInput = {
  id: string;
  receiptId: string;
  sortOrder: number;
  name: string;
  totalMinor: number;
  categoryId?: string;
  quantity?: number;
};

export async function insertReceipt(input: CreateReceiptInput) {
  const now = new Date().toISOString();
  await db.insert(receipts).values({
    id: input.id,
    userId: input.userId ?? "local",
    status: input.status,
    currencyCode: input.currencyCode,
    purchasedAt: input.purchasedAt,
    merchantName: input.merchantName,
    totalMinor: input.totalMinor,
    subtotalMinor: input.subtotalMinor,
    taxMinor: input.taxMinor,
    defaultCategoryId: input.defaultCategoryId,
    createdAt: now,
    updatedAt: now,
  });
}

export async function insertReceiptImages(images: CreateReceiptImageInput[]) {
  if (images.length === 0) return;
  await db.insert(receiptImages).values(
    images.map((img) => ({
      id: img.id,
      receiptId: img.receiptId,
      sortOrder: img.sortOrder,
      localUri: img.localUri,
      width: img.width,
      height: img.height,
      uploadStatus: "pending",
    })),
  );
}

export async function insertLineItems(items: CreateLineItemInput[]) {
  if (items.length === 0) return;
  const now = new Date().toISOString();
  await db.insert(lineItems).values(
    items.map((item) => ({
      id: item.id,
      receiptId: item.receiptId,
      sortOrder: item.sortOrder,
      name: item.name,
      totalMinor: item.totalMinor,
      categoryId: item.categoryId,
      quantity: item.quantity,
      createdAt: now,
      updatedAt: now,
    })),
  );
}

export async function getReceiptWithImages(receiptId: string) {
  const receipt = await db.query.receipts.findFirst({
    where: and(eq(receipts.id, receiptId), isNull(receipts.deletedAt)),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
      },
      defaultCategory: true,
      lineItems: {
        orderBy: (items, { asc }) => [asc(items.sortOrder)],
      },
    },
  });
  return receipt ?? null;
}

export async function listRecentReceipts(limit = 10) {
  return db.query.receipts.findMany({
    where: isNull(receipts.deletedAt),
    orderBy: (r, { desc: d }) => [d(r.createdAt)],
    limit,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export async function listAllReceipts() {
  return db.query.receipts.findMany({
    where: isNull(receipts.deletedAt),
    orderBy: (r, { desc: d }) => [d(r.purchasedAt)],
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export type UpdateReceiptReviewInput = {
  receiptId: string;
  merchantName: string;
  purchasedAt: string;
  totalMinor: number;
  defaultCategoryId: string | null;
  status: ReceiptStatus;
  lineItems: {
    id?: string;
    name: string;
    totalMinor: number;
    categoryId?: string;
  }[];
};

export type ApplyParsedReceiptInput = {
  receiptId: string;
  merchantName: string;
  purchasedAt: string;
  currencyCode: string;
  subtotalMinor?: number;
  taxMinor?: number;
  totalMinor: number;
  defaultCategoryId: string;
  confidence?: number;
  lineItems: {
    id: string;
    name: string;
    totalMinor: number;
    categoryId: string;
    quantity?: number;
  }[];
};

export async function applyParsedReceipt(input: ApplyParsedReceiptInput) {
  const now = new Date().toISOString();

  await db
    .update(receipts)
    .set({
      merchantName: input.merchantName,
      purchasedAt: input.purchasedAt,
      currencyCode: input.currencyCode,
      subtotalMinor: input.subtotalMinor,
      taxMinor: input.taxMinor,
      totalMinor: input.totalMinor,
      defaultCategoryId: input.defaultCategoryId,
      confidence: input.confidence,
      status: "needs_review",
      updatedAt: now,
    })
    .where(eq(receipts.id, input.receiptId));

  await db.delete(lineItems).where(eq(lineItems.receiptId, input.receiptId));

  if (input.lineItems.length > 0) {
    await insertLineItems(
      input.lineItems.map((item, index) => ({
        id: item.id,
        receiptId: input.receiptId,
        sortOrder: index,
        name: item.name,
        totalMinor: item.totalMinor,
        categoryId: item.categoryId,
        quantity: item.quantity,
      })),
    );
  }
}

export async function updateReceiptFromReview(input: UpdateReceiptReviewInput) {
  const now = new Date().toISOString();

  await db
    .update(receipts)
    .set({
      merchantName: input.merchantName,
      purchasedAt: input.purchasedAt,
      totalMinor: input.totalMinor,
      defaultCategoryId: input.defaultCategoryId,
      status: input.status,
      updatedAt: now,
    })
    .where(eq(receipts.id, input.receiptId));

  await db.delete(lineItems).where(eq(lineItems.receiptId, input.receiptId));

  if (input.lineItems.length > 0) {
    await insertLineItems(
      input.lineItems.map((item, index) => ({
        id: item.id ?? randomUUID(),
        receiptId: input.receiptId,
        sortOrder: index,
        name: item.name.trim(),
        totalMinor: item.totalMinor,
        categoryId: item.categoryId ?? input.defaultCategoryId ?? undefined,
      })),
    );
  }
}

export async function softDeleteReceipt(receiptId: string) {
  const now = new Date().toISOString();
  await db
    .update(receipts)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(receipts.id, receiptId));
}

export async function countDemoReceipts() {
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(and(eq(receipts.userId, "demo"), isNull(receipts.deletedAt)));
  return rows[0]?.count ?? 0;
}

export async function clearDemoReceipts() {
  const now = new Date().toISOString();
  await db
    .update(receipts)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(eq(receipts.userId, "demo"), isNull(receipts.deletedAt)));
}

function monthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function getMonthReceiptTotals(referenceDate = new Date()) {
  const { start, end } = monthRange(referenceDate);
  const rows = await db.query.receipts.findMany({
    where: and(
      isNull(receipts.deletedAt),
      gte(receipts.purchasedAt, start),
      lt(receipts.purchasedAt, end),
    ),
    columns: {
      id: true,
      status: true,
      totalMinor: true,
      currencyCode: true,
    },
  });

  const parsed = rows.filter((r) => r.totalMinor != null);
  const totalMinor = parsed.reduce((sum, r) => sum + (r.totalMinor ?? 0), 0);
  const currencyCode = parsed[0]?.currencyCode ?? rows[0]?.currencyCode ?? "ILS";

  return {
    totalMinor,
    currencyCode,
    receiptCount: rows.length,
    parsedCount: parsed.length,
  };
}

export async function listReceiptsByStatus(statuses: ReceiptStatus[], limit = 5) {
  return db.query.receipts.findMany({
    where: (r, { and: a, isNull: isN, inArray }) =>
      a(isN(r.deletedAt), inArray(r.status, statuses)),
    orderBy: (r, { desc: d }) => [d(r.updatedAt)],
    limit,
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export async function getCategoryBreakdownForMonth(referenceDate = new Date()) {
  const { start, end } = monthRange(referenceDate);
  const rows = await db
    .select({
      categoryId: lineItems.categoryId,
      total: sql<number>`sum(${lineItems.totalMinor})`,
    })
    .from(lineItems)
    .innerJoin(receipts, eq(lineItems.receiptId, receipts.id))
    .where(
      and(
        isNull(receipts.deletedAt),
        gte(receipts.purchasedAt, start),
        lt(receipts.purchasedAt, end),
        sql`${receipts.totalMinor} IS NOT NULL`,
      ),
    )
    .groupBy(lineItems.categoryId);

  return rows
    .filter((row) => row.categoryId != null)
    .map((row) => ({
      categoryId: row.categoryId as string,
      amountMinor: Number(row.total ?? 0),
    }));
}
