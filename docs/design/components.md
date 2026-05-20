# Component primitives

Small composable set in `src/components/ui/`. **Features compose primitives only** — no raw hex or ad-hoc margins in `features/`.

Token reference: [tokens](tokens.md). Layout: [layout](layout.md). a11y: [accessibility](../accessibility/README.md).

## Philosophy

- **Variants via props**, not copy-paste styles.
- **One edit surface** patterns reused across screens.
- Extend primitives before inventing screen-local UI.

## Button

| Variant | Spec |
|---------|------|
| primary | accent fill, 52pt, `radius-lg`, inverse text |
| secondary | tonal/ghost |
| destructive | text or outline dusty red |
| text | Fix later, Continue in background |

States: pressed opacity 0.92, disabled 0.45, loading keeps width.  
a11y: `role="button"`, `accessibilityState.busy/disabled`.  
No icon-only without `accessibilityLabel`.

## Surface

| Variant | Spec |
|---------|------|
| default | `surface`, `radius-xl`, no shadow |
| elevated | `surface-elevated`, hairline border, soft card shadow |
| inset | `surface-muted`, grouped list well |
| hero | `radius-2xl`, accent top strip + `accent-soft` wash |
| panel | `radius-2xl`, elevated card (lists, review imagery) |

Prefer **Surface** over ad-hoc `View` backgrounds in features.

## ElevatedGroup

Premium **panel** card (`Surface variant="panel"`) with card shadow. Optional `accentEdge` leading stripe (needs-review).  
Use for Home/Receipts receipt queues, category breakdown, settings language picker, review form sections.

## DividerList

Hairline separators between rows inside an `ElevatedGroup`.  
| Prop | Use |
|------|-----|
| `insetStart` | `ms-[4.5rem]` past thumbnail (receipt rows); `false` for form/settings rows |

## SectionHeader

Editorial section title (`title-md`) + optional subtitle. Sentence case; `Text align="start"` on copy.

## ReceiptRow

Canonical receipt list row: thumbnail, merchant, date, amount (LTR), status dot + label, RTL disclosure chevron.  
Use inside `ElevatedGroup` + `DividerList` on Home and Receipts tab.

## GroupedList

iOS Settings–style **inset** well (`Surface variant="inset"`) with hairline separators between child rows.

| Prop | Use |
|------|-----|
| `highlight` | Optional 3pt `accent` leading stripe |

Legacy inset well; prefer **ElevatedGroup** + **DividerList** for primary content lists.  
Separator inset: `ms-[4.5rem]` when rows include a thumbnail.

## Card

Composable wrapper around **Surface** (+ optional `PressableScale` when interactive).

| Variant | Spec |
|---------|------|
| default | Surface default, pad `space-4` |
| elevated / hero | Surface elevated/hero |
| interactive | PressableScale + elevated |

Max **2** nested surfaces per screen section.

## Input

Label above (always visible) → field 48pt min → `surface-muted`, `radius-sm`.  
Focus: 2pt `border-focus`. Error: caption + live region.  
Money: LTR, decimal pad.

## Sheet

Grabber, `radius-2xl` top, `elevation-2`, overlay scrim.  
Slots: title, body, footer actions.  
a11y: focus trap, return focus on dismiss.

## ListRow

64pt min (receipts); 56pt compact (settings).  
Slots: leading, title, subtitle, trailing.  
Pressable: combined a11y label e.g. “Shufersal, 342 shekels, May 18, needs review”.

## ScreenHeader

Editorial screen title (`display-lg` or `title-lg`) + optional subtitle. Use instead of bare `Text` titles in tabs.

## PressableScale

Subtle scale on press (`0.98`, 100ms). Use on buttons, list rows, interactive cards.  
When system **Reduce Motion** is on, renders a plain `Pressable` (no scale). Hook: `useReducedMotion()` in `src/theme/`.

## LoadingSkeleton

Pulse animation on `surface-muted`; static opacity when Reduce Motion is on. Parent `LoadingSkeletonGroup` sets `busy` for AT.

## Section

Micro **overline** label (`font-micro`, uppercase, tracking) + optional subtitle. `space-6` between sections.

## EmptyState

Icon 64pt, title, body, single primary CTA.

## StatusChip

24pt pill, `radius-full`, status fg on tint bg, `font-caption`.

## FAB

56pt circle, `color-accent`, `elevation-1`, icon inverse.  
Label: localized “Scan receipt”. Position: [layout](layout.md#fab).

## Primitive ↔ token map

| Primitive | Key tokens |
|-----------|------------|
| Button primary | accent, text-inverse, radius-lg |
| Card | surface, radius-lg |
| Input | surface-muted, border-focus |
| Sheet | surface, radius-2xl, overlay |
| GroupedList | surface-muted (inset), border-default separators |
| StatusChip | status-* fg/bg |

## Theme hooks (icons & motion)

| Hook | Use |
|------|-----|
| `useIconColors()` | `Ionicons` / `ActivityIndicator` — never raw hex in UI |
| `useTheme()` | Tab bar, placeholders, programmatic colors |
| `useReducedMotion()` | Disable press scale and skeleton pulse |

Tab bar in `app/(tabs)/_layout.tsx` reads `colors` from `useTheme()`.

## Storybook (post-scaffold)

Visual regression for all variants in EN + HE RTL — week 1 after scaffold.
