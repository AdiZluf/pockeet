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

- Filmstrip + large selected preview
- Add page / Retake / Delete page
- Primary: **Save & analyze** → SQLite `processing` + → [processing](processing.md)

| State | UI |
|-------|-----|
| Saving | Button loading |
| Offline | Same CTA + “Will analyze when online” |

**Excluded MVP:** drag-reorder pages (capture order only).

## RTL

Mirror control positions; amounts N/A until review.

## Related

[processing.md](processing.md) · [review.md](review.md)
