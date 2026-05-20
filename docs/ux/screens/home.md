# Home

**Route:** `/(tabs)/index`  
**Purpose:** Answer “How am I doing **this month**?” in &lt;3 seconds.

## Layout (top → bottom)

1. `ScreenHeader` (compact) + Settings + **month selector** (month label lives here only)
2. Hero: **typography-led** month total (amount → **delta vs previous month** → footnotes)
3. Insights strip (horizontal cards; MVP+ canned)
4. Category breakdown (flat bars; **rows tappable** → Receipts with filters)
5. **Receipt status overview** strip (processing, needs review, ready, failed — hide zero counts)
6. Needs-review rows (flat list, accent edge — if count &gt; 0)
7. Processing queue (if count &gt; 0)
8. **Ask Pockeet** card → [ask modal](ask-pockeet.md)
9. Recent receipts (5) + **See all** → Receipts

## Actions

| Action | Result |
|--------|--------|
| Change month | Reload local stats for selected month |
| Status chip tap | Receipts tab + month + status filter |
| Category row tap | Receipts tab + month + category filter |
| Needs-review row | → [review](review.md) |
| Recent row | → [detail](receipt-detail.md) |
| See all recent | Receipts tab (no filters) |
| Ask card | → [ask-pockeet](ask-pockeet.md) |
| Pull to refresh | Recompute stats |
| FAB | → [capture](capture.md) |

## Data

`monthlyTotalMinor`, `deltaVsPreviousMonth`, `categoryBreakdown[]`, `statusCounts`, `needsReviewCount`, `recentReceipts[]` (5), `excludedCurrencyCount` (mixed-currency footnote).

Home totals sum receipts matching **default display currency** only.

## States

| State | UI |
|-------|-----|
| Loading | Skeleton hero + chart bars + status strip |
| Empty month | ₪0 / “—” + scan CTA |
| No needs-review | Hide queue (not “0”) |
| Mixed currencies | Footnote under hero |

## Editable

**Nothing** — read-only analytics.

## MVP+ exclusions

Budget rings, second chart, real LLM insights inline, search.

## Design

Hero: `font-display-xl`; chart: [tokens](../../design/tokens.md#chart-palette).  
a11y: chart text summary for screen readers — [accessibility](../../accessibility/README.md#charts).
