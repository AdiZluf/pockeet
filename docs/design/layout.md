# Mobile layout foundations

## Safe area

- All screens except full-bleed camera.
- Header: `insets.top + space-2` (8).
- Tab bar: 49pt + `insets.bottom`.
- Sheet footer: `insets.bottom + space-4`.

## Content width

- Single column phone MVP.
- Horizontal gutter: **`space-5` (20pt)** always on scroll content.
- Chart labels stay in gutter; bars may inset to `space-4`.

## Tab bar

- Background `surface`; hairline top or tonal contrast.
- Active: accent icon + label; inactive: `text-tertiary`.
- Min 44×44pt per tab item.

## FAB

| Rule | Value |
|------|-------|
| Size | 56×56 |
| Offset end | 20pt |
| Above tab bar | 16pt |
| Hidden | capture, processing, review, auth |

Token: `fab-offset-end`, `fab-offset-bottom` — use logical `end`, not `right`.

## Sheet spacing

Grabber → `space-2` → header `space-4`/`space-3` → body gutter `space-5` → footer `space-4` + safe area. Max height 90%.

## List row rhythm

| Type | Min height | Padding |
|------|------------|---------|
| Receipt | 64pt | 20h × 12v |
| Settings | 56pt | 20h × 12v |

Separator: inset from start gutter, `border-default` hairline.

## Scroll

- Vertical default; sticky month headers on Receipts (`surface` bg).
- Pull-to-refresh: Home + Receipts only.
- No horizontal scroll except filmstrip / chart if required.

## RTL

| Mirror | Do not mirror |
|--------|----------------|
| Tabs, FAB side, chevrons, padding start/end | Digits, decimal keyboard |
| Form label edge | Chart bar meaning (keep readable) |
| Filmstrip scroll origin | Currency display order |

**Rule:** mirror flow, not numbers.  
Design HE screens early — not mirrored EN comps.

## Implementation

Use `marginStart`/`paddingEnd` or NativeWind logical utilities — never hardcode `left`/`right` in shared layout.
