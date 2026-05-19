# Data model (MVP)

Money: **`amountMinor: number`** + **`currencyCode: string`** — never floats.

## Receipt

| Field | Notes |
|-------|--------|
| id, userId | UUID |
| status | `draft \| processing \| needs_review \| ready \| failed` |
| merchantName | string MVP |
| purchasedAt | ISO date |
| currencyCode | ILS, USD, … |
| totalMinor | int |
| subtotalMinor, taxMinor | optional; UI deferred |
| confidence | aggregate / flags |
| createdAt, updatedAt, deletedAt? | soft delete |

## ReceiptImage

| Field | Notes |
|-------|--------|
| receiptId, sortOrder | 1:N ordered pages |
| localUri | always first |
| remoteUrl?, uploadStatus | cloud backup |

## LineItem

| Field | Notes |
|-------|--------|
| receiptId, sortOrder | |
| name, quantity?, unitPriceMinor?, totalMinor | |
| categoryId | fixed taxonomy |
| confidence? | per field |

## Category (system)

`id`, `slug`, `name`, `icon`, `color` — seeded ~10–12; user custom later.

## ParseJob (server-primary)

`id`, `receiptId`, `status`, `errorCode?`, `attempts` — client infers from receipt.status for MVP UI.

## Local analytics (computed)

Rebuilt on write — not source tables in MVP:
- monthly total by `YYYY-MM`
- category breakdown per month

Optional later: materialized SQLite tables if perf requires.

## Sync outbox (MVP)

`entity`, `op`, `payload`, `retryCount` — upload images + push receipt changes.

Conflict: last-write-wins per receipt; multi-device UI in v2.

## ER

```mermaid
erDiagram
  Receipt ||--o{ ReceiptImage : has
  Receipt ||--o{ LineItem : contains
  LineItem }o--|| Category : in
```

Merchant table deferred — `merchantName` on receipt only.
