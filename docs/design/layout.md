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

- Background `surface`; hairline top `border-default`.
- Active: `accent` icon + label; inactive: `text-tertiary` (via `useTheme()` in tab layout).
- Min 44×44pt per tab item.

## Grouped lists (Home, Receipts)

- Month sections: `Section` overline + **`GroupedList`** inset well (not elevated card).
- Home month total: typography on `background` with small accent mark — not a hero card panel.
- Category breakdown: rows inside one `GroupedList`; chart summary `accessibilityLabel` on the group.

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

## Layout direction (MVP)

**English-only, LTR.** `initI18n()` locks `I18nManager` to LTR at startup. Hebrew + RTL deferred to v1.1+.

| LTR pattern | Notes |
|-------------|--------|
| `Text align="start"` / `"end"` | Physical left/right in LTR |
| `moneyTextProps` on amounts | LTR digits, right-aligned in rows |
| `chevron-back` / `chevron-forward` | Fixed for LTR navigation |

Prefer logical `ms`/`me`/`ps`/`pe` where harmless for future RTL — avoid hardcoding `left`/`right` in shared layout when easy.
