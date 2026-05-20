# Home

**Route:** `/(tabs)/index`  
**Purpose:** Answer “How am I doing **this month**?” in &lt;3 seconds.

## Layout (top → bottom)

1. Quiet app bar + Settings + **month selector**
2. Hero: **typography-led** month total (amount → month label → **delta vs previous month**)
3. Category breakdown (flat bars; **rows tappable** → Receipts with filters)
4. **Receipt status overview** strip (processing, needs review, ready, failed — hide zero counts)
5. Needs-review rows (flat list, accent edge — if count &gt; 0)
6. Processing queue (if count &gt; 0)
7. Recent receipts (5) + **See all** → Receipts
8. **Ask Pockeet** card → [ask modal](ask-pockeet.md)

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
