# Receipts list

**Route:** `/(tabs)/receipts`  
**Purpose:** Full receipt management with filters.

## UI

- Dynamic subtitle (all receipts / filtered summary)
- **Filter bar** — Filters button + active chips + Clear all
- Sticky month headers (when showing multiple months)
- Rows: merchant, amount (tabular), date, status
- Query from Home: `?month=&status=&categories=&from=&to=`

## Actions

- Tap → [detail](receipt-detail.md)
- Filters → [receipt-filters](receipt-filters.md) sheet
- Remove chip → update one filter dimension
- Clear all → default view (all receipts)
- Pull to refresh
- FAB → [capture](capture.md)

## States

| State | UI |
|-------|-----|
| Empty (no receipts) | Illustration + FAB CTA |
| Empty (filtered) | “No matches” + Clear filters |
| End | Optional “That’s everything” |

## Excluded MVP+

FTS search, sort options, export, saved filter presets.

## Row spec

64pt min height — [components/ListRow](../../design/components.md#listrow).
