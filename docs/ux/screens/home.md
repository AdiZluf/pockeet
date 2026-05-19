# Home

**Route:** `/(tabs)/index`  
**Purpose:** Answer “How am I doing **this month**?” in &lt;3 seconds.

## Layout (top → bottom)

1. Month picker + Settings (trailing)
2. Hero: total this month + delta vs last month (neutral framing)
3. One category chart (tap → Receipts filtered)
4. Needs-review banner (if count &gt; 0)
5. Recent receipts (max 5) + “See all” → Receipts tab

## Actions

| Action | Result |
|--------|--------|
| Change month | Reload local stats |
| Needs-review banner | → [needs-review](needs-review.md) |
| Recent row | → [detail](receipt-detail.md) |
| Chart segment | Receipts tab + in-memory month/category filter |
| Pull to refresh | Recompute stats; retry uploads |
| FAB | → [capture](capture.md) |

## Data

`monthlyTotalMinor`, `deltaVsPreviousMonth`, `categoryBreakdown[]`, `needsReviewCount`, `recentReceipts[]` (5).

## States

| State | UI |
|-------|-----|
| Loading | Skeleton hero + chart bars + rows |
| Empty month | ₪0 + “Scan your first receipt” |
| No needs-review | Hide banner (not “0”) |
| Offline | Still show local data; processing chips on rows |

## Editable

**Nothing** — read-only analytics.

## MVP exclusions

Budget rings, AI cards, multiple charts, search, personalization.

## Design

Hero: `font-display-xl`; chart: [tokens](../../design/tokens.md#chart-palette).  
a11y: chart text summary for screen readers — [accessibility](../../accessibility/README.md#charts).
