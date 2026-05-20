# Receipt filters

**Presentation:** Bottom sheet from Receipts tab (not a route)  
**Purpose:** Narrow receipt list by period, categories, and status.

## Sections

### Period

- Quick picks: This month, Last month, Last 3 months
- Month picker — labels `MM/YY`, value `YYYY-MM`
- Custom range — From / To (inclusive on `purchasedAt`; fallback `createdAt`)
- Month and custom range are mutually exclusive

### Categories

- Multi-select chips (8 seeded categories)
- Empty selection = all categories

### Status (single-select)

| UI | DB statuses |
|----|-------------|
| All | (none) |
| Processing | `draft`, `processing` |
| Needs review | `needs_review` |
| Ready | `ready` |
| Failed | `failed` |

## Footer

- **Apply** — updates filter state + closes sheet
- **Clear** — resets to defaults inside sheet

## Receipts tab integration

- Filter button + badge count
- Active filter chips (removable individually)
- **Clear all** when any filter active
- Query params: `month`, `status`, `categories` (comma-separated), `from`, `to`
- Empty filtered state: “No receipts match these filters” + clear CTA

## Persistence

- In-memory + URL query for session only (no SQLite presets in MVP+)

## Related

- [receipts-list.md](receipts-list.md) · [navigation.md](../navigation.md)
