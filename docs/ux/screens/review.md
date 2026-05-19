# Review / Edit

**Route:** `/receipt/[id]/review`  
**Purpose:** Confirm or fix parsed data — **primary trust screen.**

## Layout

- Image filmstrip (view only; full-screen zoom)
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

Skeleton while loading parse; empty items prompt; save error toast.

## RTL

Labels on reading edge; numeric fields **LTR** — [layout](../../design/layout.md#rtl).

## Excluded

Split categories, barcode, autocomplete, audit log.
