# Processing

**Route:** `/receipt/[id]/processing`  
**Purpose:** Set expectation while local fake parse runs; allow escape.

## UI

- Hero card with receipt thumbnail, accent progress strip, staged status copy
- Stages (~2s): reading → extracting → organizing → ready
- Success: checkmark on thumbnail, light haptic, brief pause (~720ms) before review
- **Review now** (enabled when parse completes) · **Continue in background** → Home

## Behavior

| Event | Navigation |
|-------|------------|
| Parse complete | Auto `replace` → [review](review.md) (fade) after success beat |
| User leaves early | Parse continues in background (started on save) |

Poll SQLite ~400ms while foregrounded. In-flight parse deduped per receipt id.

## Motion

- Fade-in hero and footer actions
- Thumbnail scale-in; progress bar eases over parse duration
- Respects system Reduce Motion (instant progress, no scale)

## a11y

`accessibilityLiveRegion="polite"` on status card — [accessibility](../../accessibility/README.md).

## Excluded MVP

Cancel job UI, raw OCR display, percentage labels.
