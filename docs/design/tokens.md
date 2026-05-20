# Design tokens

Canonical for **light mode MVP** (Warm Ledger art direction). Implement in `src/theme/` — screens import **semantic tokens only**, never primitives.

Dark mappings defined for v1.1. Styling: **NativeWind v4** reading CSS variables from `global.css`.

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
| `radius-lg` | **16** | Buttons |
| `radius-2xl` | **24** | Cards, hero |
| `radius-3xl` | **28** | Sheet top |
| `radius-full` | 9999 | FAB, pills |

## Typography

**Families:** `font-display` — **Outfit** (money, hero totals). `font-sans` — **Plus Jakarta Sans** (UI copy).

| Token | Size / line | Weight | Use |
|-------|-------------|--------|-----|
| `display-hero` | 48/52 | 700 | Home month total |
| `display-xl` | 40/44 | 600 | Large amounts |
| `display-lg` | 34/40 | 600 | Receipts tab title, review merchant |
| `title-lg` | 26/32 | 700 | Screen titles |
| `title-md` | 20/26 | 600 | Sections |
| `body-lg` | 17/24 | 400 | Body emphasis |
| `body` | 16/22 | 400 | Body |
| `label` | 14/20 | **600** | Chips, CTAs |
| `caption` | 13/18 | 500 | Meta |
| `micro` | 11/16 | 500 | Legacy compact |

**Money:** always `tabular-nums` + display family. Prefer **sentence-case** section labels (`SectionEyebrow`) over uppercase micro overlines.

## Elevation

| Tier | Use |
|------|-----|
| `ambient` | List rows on canvas |
| `card` | Default grouped content |
| `raised` | Insights, featured cards |
| `floating` | FAB, sheet, composer/filter docks |
| `fab` | FAB halo (teal-tinted glow) |

Implement via `surfaceElevation` in `src/theme/surfaces.ts`. Raised cards include optional 1px top highlight (`Surface` elevated/featured).

## Canvas

| Token | Role |
|-------|------|
| `background` | Warm sand `#F3EFE8` |
| `background-top` / `background-bottom` | Tab gradient endpoints |
| `CanvasBackground` | Primitive: sand gradient on Home/Receipts |

## Accent & chroma

| Token | Hex / role |
|-------|------------|
| `accent` | `#1F6F78` — FAB, primary CTA |
| `accent-bright` | `#2A8A94` — gradient stops |
| `accent-gradient` | `#185A61 → #3D9AA6` — heroes, Ask, onboarding |
| `accent-glow` | FAB halo (~28% opacity) |
| `warm-highlight` | `#C4A574` — sparing money emphasis |
| `delta-up` / `delta-down` | Soft green / rose hero chips |

~≤10% of Home pixels accent-colored; money on gradient heroes uses `foreground-onAccent`.

## Surface tiers

| Variant | Visual |
|---------|--------|
| `canvas` | Gradient or sand (tab roots) |
| `surface` / `surface-elevated` | Warm white `#FFF9F4` |
| `surface-inset` | Tinted `#EDE8E0` — filters, docks |
| `card-hero` | Gradient via `HeroSurface` |

## Semantic colors (light)

| Token | Hex |
|-------|-----|
| `color-background` | `#F3EFE8` |
| `color-surface` | `#FFF9F4` |
| `color-surface-muted` | `#EDE8E0` |
| `color-surface-inset` | `#EDE8E0` |
| `color-text-primary` | `#1C1917` |
| `color-text-secondary` | `#57534E` |
| `color-text-tertiary` | `#78716C` |
| `color-text-inverse` | `#FFFCF9` |
| `color-text-on-accent` | `#FFFFFF` |
| `color-border-default` | `#E7E5E4` |
| `color-accent` | `#1F6F78` |
| `color-overlay` | `#1C191780` |

## Status colors

| Status | fg | bg tint |
|--------|-----|---------|
| processing | `#5B6B7A` | `#5B6B7A1A` |
| review | `#B45309` | `#F59E0B1F` |
| ready | `#4A7C59` | `#4A7C591A` |
| failed | `#B84A4A` | `#B84A4A1A` |

Never full-screen status backgrounds.

## Chart palette

Saturated fintech set (8 colors) — teal lead, amber, violet, coral. Defined as `--chart-1…8` in `global.css`. Bar opacity 0.85. Hero total always primary on sand; **delta chip** for directional hue on gradient hero.

## Gradients (primitives only)

`brandGradients` in `src/theme/gradients.ts` — used by `HeroSurface`, `GradientIconWell`, primary `Button`, Ask featured border. Features must not import raw gradient hex.

## Theme file layout

```
src/theme/
  primitives.ts
  semantic.light.ts
  semantic.dark.ts
  typography.ts
  surfaces.ts
  gradients.ts
  motion.ts
  a11y.ts
  index.ts
```

## Rebrand

Swap primitive scales → remap semantics. Components unchanged.
