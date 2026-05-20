# Capture / Scan

**Routes:** `capture/index` (camera), `capture/preview`  
**Purpose:** Acquire 1–5 receipt images; never lose a photo.

## Camera

- Full-bleed viewfinder; Close; Gallery; Shutter; **Upload PDF** (document picker, PDF only)
- Shutter → add to session strip; stay on camera
- **Upload PDF** (empty session) → save locally → `processing` → fake parse → review (skips preview/crop)
- Max **5** photo pages; min 1 photo to continue to preview

| State | UI |
|-------|-----|
| Permission denied | Copy + Open Settings |
| Ready | Viewfinder + controls |

**Excluded MVP:** edge detection, blur score, auto-crop UI.

## Preview

- Filmstrip + large selected preview (crop hint on image + selected thumb badge)
- **Page actions** panel: Edit image, Remove page, Add page, Upload PDF (replaces photo session after confirm)
- Primary **Save & analyze** docked below panel → SQLite `processing` + → [processing](processing.md)

| State | UI |
|-------|-----|
| Saving | Button loading |
| Offline | Same CTA + “Will analyze when online” |

**Excluded MVP:** drag-reorder pages (capture order only).

## Crop (`capture/crop`)

- Header cancel uses filled secondary-style control (not text-only)
- **Crop frame** in upper workspace; footer panel with hint + Cancel / **Use crop**
- Pinch/pan inside frame; accent outline; overlay dims outside crop

## RTL

Mirror control positions; amounts N/A until review.

## Related

[processing.md](processing.md) · [review.md](review.md)
