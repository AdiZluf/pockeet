# Product vision

## North star

**“Calm clarity in your pocket.”**

Help people scan receipts and understand **where their money went this month** — without accounting anxiety or dashboard clutter.

## What success feels like

| Moment | User job | Success |
|--------|----------|---------|
| After checkout | Don’t lose the receipt | Saved in &lt;10s |
| Weekly | “Did food spending spike?” | Category breakdown is obvious |
| Month-end | “What happened?” | Home answers in one screen |

## Positioning (not another scanner)

1. **Monthly clarity** — Home is “this month,” not a file cabinet.
2. **Correction as product** — Review UX is the hero; parsing is never perfect.
3. **Bilingual by design** — EN/HE UI + Hebrew/English/mixed receipts (RTL, ₪).
4. **Restrained insights** — Few high-signal signals, not noisy AI tips.

## Core concepts

| Entity | Definition |
|--------|------------|
| **Receipt** | One shopping trip; may have multiple photos |
| **Line item** | Parsed or manual row (name, qty, price, category) |
| **Merchant** | Store name (string in MVP; normalized later) |
| **Category** | Fixed taxonomy in MVP (~10–12) |
| **Month** | Rollup dimension for analytics — not user-managed |

## Product principles

- **Useful = actionable + explainable** — insights link to receipts/items.
- **Good enough by default** — auto-categorize; user fixes exceptions.
- **Never block capture on network** — local save first; parse catches up.
- **Trust through transparency** — status, confidence, “Edited” when changed.

## Emotional / brand direction

Calm, trustworthy, modern, premium, fast, warm minimal.  
Design expression: [visual-identity](../design/visual-identity.md).

## Out of scope for vision doc

MVP boundaries → [mvp-scope](mvp-scope.md).  
Shipping timeline → [roadmap](roadmap.md).  
Technical shape → [architecture](../engineering/architecture.md).
