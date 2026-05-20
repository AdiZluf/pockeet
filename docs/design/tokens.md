# Design tokens

Canonical for **light mode MVP**. Implement in `src/theme/` — screens import **semantic tokens only**, never primitives.

Dark mappings defined for v1.1. Styling: **NativeWind v4** (recommended) reading CSS variables from theme.

## Spacing (8pt grid)

| Token | pt | Usage |
|-------|-----|--------|
| `space-0` | 0 | Flush |
| `space-0.5` | 2 | Hairline tweaks |
| `space-1` | 4 | Icon gaps, chip padding |
| `space-2` | 8 | Inline groups |
| `space-3` | 12 | Compact row padding |
| `space-4` | 16 | Card padding |
| `space-5` | 20 | **Screen gutter** |
| `space-6` | 24 | Section gap |
| `space-7` | 32 | Major break |
| `space-8` | 40 | Large break |
| `space-9` | 48 | Hero breathing |
| `space-10` | 64 | Empty state aid |

## Radius

| Token | pt | Usage |
|-------|-----|--------|
| `radius-sm` | 8 | Chips, inputs |
| `radius-md` | 12 | Thumbs |
| `radius-lg` | **16** | Buttons, cards |
| `radius-2xl` | 24 | Sheet top |
| `radius-full` | 9999 | FAB, pills |

## Typography

| Token | Size / line | Weight | Use |
|-------|-------------|--------|-----|
| `font-display-xl` | 40/48 | 500 | Home hero total |
| `font-display-lg` | 32/40 | 500 | Large amounts |
| `font-title-lg` | 22/28 | 600 | Screen titles |
| `font-title-md` | 20/26 | 600 | Sections |
| `font-body-lg` | 17/24 | 400 | Body+ |
| `font-body` | 16/22 | 400 | Body |
| `font-label` | 14/20 | 500 | Labels |
| `font-caption` | 13/18 | 400 | Chips, meta |
| `font-micro` | 11/16 | 500 | Tabs |

**Families:** `font-sans` — SF Pro Text / Roboto; **Heebo** when `he`. `font-display` — SF Pro Rounded for money.  
**Money:** always `tabular-nums`.

## Elevation

| Token | Use |
|-------|-----|
| `elevation-0` | Default surfaces |
| `elevation-1` | Elevated cards, list groups |
| `elevation-2` | Sheet |
| `shadow-fab` | FAB (teal-tinted, soft) |

Shadow: soft, large blur, low opacity — never crisp drops. Implement via `surfaceElevation` in `src/theme/surfaces.ts`.

## Accent usage

| Token | Use |
|-------|-----|
| `accent` | FAB, primary button, hero strip, chart emphasis |
| `accent-muted` | Chips, icon wells |
| `accent-soft` | Chart track, thumbnail placeholder |

~≤10% of Home pixels accent-colored; money stays `text-primary`.

## Semantic colors (light)

| Token | Hex |
|-------|-----|
| `color-background` | `#F7F5F2` |
| `color-surface` | `#FFFCF9` |
| `color-surface-muted` | `#F0EDE8` |
| `color-text-primary` | `#1C1917` |
| `color-text-secondary` | `#57534E` |
| `color-text-tertiary` | `#78716C` |
| `color-text-inverse` | `#FFFCF9` |
| `color-border-default` | `#E7E5E4` |
| `color-border-focus` | `#1F6F78` |
| `color-accent` | `#1F6F78` |
| `color-accent-muted` | `#1F6F781F` |
| `color-overlay` | `#1C191766` |

## Dark mode

| Token | Hex |
|-------|-----|
| `color-background` | `#141210` |
| `color-surface` | `#1F1C1A` |
| `color-surface-muted` | `#292524` |
| `color-text-primary` | `#F5F5F4` |
| `color-accent` | `#4A9BA6` |

(Full set mirrors light roles — implement paired in `semantic.dark.ts`.)

## Status colors

| Status | fg | bg tint |
|--------|-----|---------|
| processing | `#5B6B7A` | `#5B6B7A1A` |
| review | `#B45309` | `#F59E0B1F` |
| ready | `#4A7C59` | `#4A7C591A` |
| failed | `#B84A4A` | `#B84A4A1A` |

Never full-screen status backgrounds.

## Chart palette

| Token | Hex |
|-------|-----|
| chart-1 … chart-7 | `#5B8A8F` … `#6A9A8B` |
| chart-8 (Other) | `#A8A29E` |

Bar opacity 0.85. Hero total always `text-primary` — delta chip only for directional hue.

## Surfaces

`background` → `surface` → `surface-muted` → `elevated` (rare).  
Camera viewfinder may use `#000` — exception.

## Theme file layout

```
src/theme/
  primitives.ts      # not imported by screens
  semantic.light.ts
  semantic.dark.ts
  typography.ts
  spacing.ts
  motion.ts
  a11y.ts
  index.ts           # ThemeProvider
```

## Rebrand

Swap primitive scales → remap semantics in one place. Components unchanged.
