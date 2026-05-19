import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const receiptStatuses = [
  "draft",
  "processing",
  "needs_review",
  "ready",
  "failed",
] as const;

export type ReceiptStatus = (typeof receiptStatuses)[number];

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameHe: text("name_he").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const receipts = sqliteTable(
  "receipts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().default("local"),
    status: text("status").notNull().$type<ReceiptStatus>(),
    merchantName: text("merchant_name"),
    purchasedAt: text("purchased_at"),
    currencyCode: text("currency_code").notNull().default("ILS"),
    subtotalMinor: integer("subtotal_minor"),
    taxMinor: integer("tax_minor"),
    totalMinor: integer("total_minor"),
    defaultCategoryId: text("default_category_id").references(() => categories.id),
    confidence: integer("confidence"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    index("receipts_user_id_idx").on(table.userId),
    index("receipts_status_idx").on(table.status),
    index("receipts_purchased_at_idx").on(table.purchasedAt),
  ],
);

export const receiptImages = sqliteTable(
  "receipt_images",
  {
    id: text("id").primaryKey(),
    receiptId: text("receipt_id")
      .notNull()
      .references(() => receipts.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull(),
    localUri: text("local_uri").notNull(),
    remoteUrl: text("remote_url"),
    uploadStatus: text("upload_status").notNull().default("pending"),
    width: integer("width"),
    height: integer("height"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("receipt_images_receipt_id_idx").on(table.receiptId)],
);

export const lineItems = sqliteTable(
  "line_items",
  {
    id: text("id").primaryKey(),
    receiptId: text("receipt_id")
      .notNull()
      .references(() => receipts.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull(),
    name: text("name").notNull(),
    quantity: integer("quantity"),
    unitPriceMinor: integer("unit_price_minor"),
    totalMinor: integer("total_minor").notNull(),
    categoryId: text("category_id").references(() => categories.id),
    confidence: integer("confidence"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("line_items_receipt_id_idx").on(table.receiptId)],
);

export const syncOutbox = sqliteTable("sync_outbox", {
  id: text("id").primaryKey(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull(),
  op: text("op").notNull(),
  payload: text("payload").notNull(),
  retryCount: integer("retry_count").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const receiptsRelations = relations(receipts, ({ many, one }) => ({
  images: many(receiptImages),
  lineItems: many(lineItems),
  defaultCategory: one(categories, {
    fields: [receipts.defaultCategoryId],
    references: [categories.id],
  }),
}));

export const receiptImagesRelations = relations(receiptImages, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptImages.receiptId],
    references: [receipts.id],
  }),
}));

export const lineItemsRelations = relations(lineItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [lineItems.receiptId],
    references: [receipts.id],
  }),
  category: one(categories, {
    fields: [lineItems.categoryId],
    references: [categories.id],
  }),
}));
