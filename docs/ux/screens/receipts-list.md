# Receipts list

**Route:** `/(tabs)/receipts`  
**Purpose:** Full history; scroll by month.

## UI

- Sticky month headers
- Rows: merchant, amount (tabular), date, status chip
- Optional query from Home: `?month=&category=`

## Actions

- Tap → [detail](receipt-detail.md)
- Pull to refresh
- FAB → [capture](capture.md)
- Paginate ~50 per fetch

## States

| State | UI |
|-------|-----|
| Empty | Illustration + point to FAB |
| End | “That’s everything” |

## Excluded MVP

Search, filters, sort, export, thumbnails in list.

## Row spec

64pt min height — [components/ListRow](../../design/components.md#listrow).
