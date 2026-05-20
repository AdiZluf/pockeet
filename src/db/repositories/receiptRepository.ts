import { and, desc, eq, gte, inArray, isNull, lt, lte, sql } from "drizzle-orm";
import { randomUUID } from "expo-crypto";

import {
  DEFAULT_RECEIPT_FILTERS,
  STATUS_FILTER_STATUSES,
  type ReceiptFilters,
} from "../receiptFilters";
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

function monthRangeFromKey(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function buildFilterConditions(filters: ReceiptFilters = DEFAULT_RECEIPT_FILTERS) {
  const conditions = [isNull(receipts.deletedAt)];

  if (filters.month) {
    const { start, end } = monthRangeFromKey(filters.month);
    conditions.push(gte(receipts.purchasedAt, start), lt(receipts.purchasedAt, end));
  } else {
    if (filters.from) {
      conditions.push(gte(receipts.purchasedAt, `${filters.from}T00:00:00.000Z`));
    }
    if (filters.to) {
      conditions.push(lte(receipts.purchasedAt, `${filters.to}T23:59:59.999Z`));
    }
  }

  if (filters.categories.length > 0) {
    conditions.push(inArray(receipts.defaultCategoryId, filters.categories));
  }

  if (filters.status !== "all") {
    conditions.push(inArray(receipts.status, STATUS_FILTER_STATUSES[filters.status]));
  }

  return and(...conditions);
}

export async function getMonthReceiptTotals(
  referenceDate = new Date(),
  displayCurrency?: string,
) {
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
  const matching = displayCurrency
    ? parsed.filter((r) => r.currencyCode === displayCurrency)
    : parsed;
  const totalMinor = matching.reduce((sum, r) => sum + (r.totalMinor ?? 0), 0);
  const otherCurrencyCount = displayCurrency
    ? parsed.filter((r) => r.currencyCode !== displayCurrency).length
    : 0;

  return {
    totalMinor,
    currencyCode: displayCurrency ?? matching[0]?.currencyCode ?? rows[0]?.currencyCode ?? "ILS",
    receiptCount: rows.length,
    parsedCount: matching.length,
    otherCurrencyCount,
  };
}

export async function getStatusCountsForMonth(referenceDate = new Date()) {
  const { start, end } = monthRange(referenceDate);
  const rows = await db
    .select({
      status: receipts.status,
      count: sql<number>`count(*)`,
    })
    .from(receipts)
    .where(
      and(
        isNull(receipts.deletedAt),
        gte(receipts.purchasedAt, start),
        lt(receipts.purchasedAt, end),
      ),
    )
    .groupBy(receipts.status);

  const counts = {
    processing: 0,
    needs_review: 0,
    ready: 0,
    failed: 0,
  };

  for (const row of rows) {
    const n = Number(row.count ?? 0);
    if (row.status === "draft" || row.status === "processing") {
      counts.processing += n;
    } else if (row.status === "needs_review") {
      counts.needs_review = n;
    } else if (row.status === "ready") {
      counts.ready = n;
    } else if (row.status === "failed") {
      counts.failed = n;
    }
  }

  return counts;
}

export async function getMonthDeltaMinor(
  referenceDate: Date,
  displayCurrency: string,
): Promise<number | null> {
  const current = await getMonthReceiptTotals(referenceDate, displayCurrency);
  const prevDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
  const previous = await getMonthReceiptTotals(prevDate, displayCurrency);
  if (previous.parsedCount === 0) return null;
  return current.totalMinor - previous.totalMinor;
}

export async function listReceiptsFiltered(filters: ReceiptFilters = DEFAULT_RECEIPT_FILTERS) {
  return db.query.receipts.findMany({
    where: buildFilterConditions(filters),
    orderBy: (r, { desc: d }) => [d(r.purchasedAt)],
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.sortOrder)],
        limit: 1,
      },
    },
  });
}

export async function countReceiptsFiltered(filters: ReceiptFilters = DEFAULT_RECEIPT_FILTERS) {
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(buildFilterConditions(filters));
  return Number(rows[0]?.count ?? 0);
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

export async function getCategoryBreakdownForMonth(
  referenceDate = new Date(),
  displayCurrency?: string,
) {
  const { start, end } = monthRange(referenceDate);
  const currencyClause = displayCurrency
    ? eq(receipts.currencyCode, displayCurrency)
    : undefined;
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
        currencyClause,
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
