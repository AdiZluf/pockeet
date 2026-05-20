# Capture / Scan

**Routes:** `capture/index` (camera), `capture/preview`  
**Purpose:** Acquire 1–5 receipt images; never lose a photo.

## Camera

- Full-bleed viewfinder; Close; Gallery; Shutter; flash
- Shutter → add to session strip; stay on camera
- Max **5** pages; min 1 to continue

| State | UI |
|-------|-----|
| Permission denied | Copy + Open Settings |
| Ready | Viewfinder + controls |

**Excluded MVP:** edge detection, blur score, auto-crop UI.

## Preview

- Filmstrip + large selected preview (crop hint on image + selected thumb badge)
- **Page actions** panel: Edit image, Remove page (destructive tonal), Add page (emphasis)
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
