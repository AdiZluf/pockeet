# Processing

**Route:** `/receipt/[id]/processing`  
**Purpose:** Set expectation while upload + parse run; allow escape.

## UI

- Thumbnail, status line, indeterminate progress
- **Continue in background** → Home (row shows `processing`)
- Optional Close → confirm → Home

## Behavior

| Event | Navigation |
|-------|------------|
| Parse complete | Auto `replace` → [review](review.md) (~300ms success) |
| Failed | Retry + Enter manually → review with empty template |
| Offline | “Saved — analyze when online” + Go home |

Poll parse status ~2.5s while foregrounded.

## States

Uploading → Analyzing → Success | Failed | Offline queued

## Excluded MVP

Cancel job UI, raw OCR display, fake % progress.

## a11y

`accessibilityLiveRegion` for status changes — [accessibility](../../accessibility/README.md).
