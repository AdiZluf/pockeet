# Needs-review queue

**Route:** `/needs-review` (from Home banner)  
**Purpose:** Actionable inbox for `needs_review` receipts.

## UI

List: merchant, total, date, **reason snippet** (localized error code).

## Actions

- Tap row → [review](review.md)
- Back → Home

## States

Empty: “All caught up” (banner hidden when count 0 on Home).

## Excluded MVP

Bulk actions, snooze, swipe delete (delete from detail only).
