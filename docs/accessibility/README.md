# Accessibility

WCAG **2.2 Level AA** target for core flows. Calm premium UI — **not** clinical “accessibility mode” styling.

Visual baseline: [tokens](../design/tokens.md). Components: [components](../design/components.md).

## Principles

| Pillar | Practice |
|--------|----------|
| Perceivable | Contrast, dynamic type, non-color status cues |
| Operable | 44pt targets, reduce motion, no gesture-only critical actions |
| Understandable | Plain errors, predictable nav |
| Robust | Roles/labels on all custom controls |

## Color contrast

| Pair | Minimum |
|------|---------|
| text-primary on background | 4.5:1 |
| text-secondary on background | 4.5:1 |
| text-inverse on accent | 4.5:1 |

CI: automated token pair checks on PR. Category charts: **never color-only** — label + value always visible.

## Typography

- Body ≥16pt at default dynamic type.
- Support scaling to ~200% — scroll/flex layouts; no clipped primary CTAs.
- Hebrew: +2–4% line height on titles; real Heebo weights.

## Touch targets

- **Minimum 44×44pt** (WCAG 2.5.8).
- Primary buttons 52pt height.
- Full-width list rows ≥64pt.

## Motion

Honor `Reduce Motion` (implemented via `useReducedMotion()` in `src/theme/`):
- **PressableScale:** no scale — plain `Pressable`.
- **LoadingSkeleton:** static opacity (~0.72), no pulse.
- Chart width animation: disabled when added (static bars today).
- Crossfade ≤120ms OK.
- Consider disabling haptics when reduced.

## Charts

- Visible label + amount + % per category.
- Tappable bar: `role="button"`, combined label.
- Spoken summary on Home chart container e.g. “Top: Groceries 45%, 1,920 shekels”.
- Optional hidden accessible sort table for SR order.

## Screen readers

- Screen accessible title on every route.
- List headers announce count: “Receipts, 24 items”.
- Processing: `accessibilityLiveRegion` polite updates.
- Receipt images: “Receipt image, page 1 of 3”.

## Focus

- 2pt `border-focus` for keyboard/switch users (Android).
- VoiceOver order follows visual order; RTL mirrors reading order.

## Forms (Review)

- Visible labels always (no placeholder-only).
- Error: focus first invalid field + announce.
- Money fields: LTR + label includes currency.

## Loading / errors

- Skeletons: `importantForAccessibility="no-hide-descendants"` on decorative blocks.
- Parent `busy` while loading.
- Parse failure: `alert` or live region + labeled Retry.

## RTL

Mirror layout flow; **isolate** bidi for mixed merchant names.  
Switching EN↔HE reloads the app so `I18nManager` direction applies (Settings from Home gear).  
Money uses `moneyTextProps` (LTR). Numbers and charts stay LTR — [layout](../design/layout.md#rtl).

## QA (each release)

1. VoiceOver: scan → review → Home (EN + HE RTL).
2. TalkBack: same flows on Android.
3. Largest dynamic type — CTAs reachable.
4. Reduce motion — no lost information.
5. Token contrast CI green.

## Common mistakes

- Icon-only buttons without labels
- `allowFontScaling={false}` globally
- Red/green-only deltas
- Hiding all children of loading view without parent `busy`
- English-only accessibility hints
- Separate “accessible layouts”

## Legal posture

Design for accessibility by default (aligns with EU Accessibility Act thinking for consumer apps). Document known gaps in release notes; fix P0 blockers before public launch.
