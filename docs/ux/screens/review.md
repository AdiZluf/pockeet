# Review / Edit

**Route:** `/receipt/[id]/review`  
**Purpose:** Confirm or fix parsed data — **primary trust screen.**

## Layout

- Receipt hero image (elevated frame, accent strip) + optional page filmstrip
- Staggered fade-in sections after load; scan flow uses “parsed” subtitle copy
- Merchant, date, total, receipt category
- Line items list (+ Add, swipe delete)
- **Looks good** (primary) · **Fix later** (secondary)

Re-edit from detail: CTA **Save changes** instead of Looks good.

## Actions

| Action | Result |
|--------|--------|
| Looks good | Validate → `ready` → recompute → `replace` Home |
| Fix later | Save → `needs_review` → back/Home |
| Field edits | Inline or sheet single-field |

## Validation (Looks good)

- Merchant required; date valid; total &gt; 0
- Line sum vs total: soft warning ±5% or ±₪5; allow override

## Confidence

Dotted underline or thin amber accent on low-confidence fields — never % scores or full-screen yellow.

## Editable

Merchant, date, total, category, line items.  
**Not MVP:** images, currency, tax/subtotal.

## States

Layout-matched skeleton while loading; empty line-item row by default; save error alert.

## Motion

Stack uses fade into review from processing. Section entrances respect Reduce Motion.

## Implementation (MVP)

- Route: `app/receipt/[id]/review.tsx` · `ReceiptReviewView`
- Save: `updateReceiptFromReview` in SQLite (local only)
- Navigation: needs-review rows → review; detail **Edit**; processing **Review now**
- Re-edit uses **Save changes** (`source=detail`); first pass uses **Looks good** / **Fix later**

## RTL

Labels on reading edge; numeric fields **LTR** — [layout](../../design/layout.md#rtl).

## Excluded

Split categories, barcode, autocomplete, audit log.
