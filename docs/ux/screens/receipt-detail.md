# Receipt detail

**Route:** `/receipt/[id]`  
**Purpose:** Read-only summary; path to edit or delete.

## UI

- Image carousel (pinch zoom)
- Merchant, date, category, total (with `currencyCode`)
- Line items
- **Edit** → [review](review.md)
- **Delete** (confirm sheet)

## Processing state

Banner “Still analyzing…”; skeleton items; Edit disabled until `needs_review` or `ready` (`failed` → manual via review).

## Editable

**None on this screen** — all edits in Review.

## Badges

`Edited` if `updatedAt` &gt; parsed; status chip if not `ready`.

## Excluded MVP

Share, notes, duplicate, image replace.
