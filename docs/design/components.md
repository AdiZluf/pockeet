# Component primitives

Small composable set in `src/components/ui/`. **Features compose primitives only** — no raw hex or ad-hoc margins in `features/`.

Token reference: [tokens](tokens.md). Layout: [layout](layout.md). a11y: [accessibility](../accessibility/README.md).

## Philosophy

- **Variants via props**, not copy-paste styles.
- **Warm Ledger** — layered sand canvas, gradient hero moments, tiered elevation.
- Extend primitives before inventing screen-local UI.

## Button

| Variant | Spec |
|---------|------|
| primary | **accent gradient** fill, 52pt, `radius-lg`, on-accent text |
| secondary | tonal/ghost |
| destructive | text or outline dusty red |
| text | tertiary actions |

States: pressed opacity 0.92, disabled 0.45, loading keeps width.

## Surface

| Variant | Spec |
|---------|------|
| default | `surface`, `radius-2xl` |
| elevated | warm white, hairline border, **raised** shadow + top highlight |
| inset | `surface-inset` |
| featured | raised + highlight — insights, Ask assistant, review blocks |
| dock | inset + **floating** shadow — filter bar, composer, review footer |
| hero | wrapper for `HeroSurface` gradient |

## HeroSurface

`LinearGradient` hero card with optional accent orb. White/on-accent typography. Home month total, processing celebration, onboarding/auth headers.

## GradientIconWell

Icon in gradient circle (`expo-linear-gradient`). Add Receipt tiles, Ask, onboarding slides.

## SectionEyebrow

Teal dot + `title-md` **sentence-case** section title. Replaces uppercase `Section` overlines in features.

## DeltaChip

Colored pill for month-over-month delta on gradient hero (up / down / neutral).

## CanvasBackground

Warm sand vertical gradient for tab roots (Home, Receipts).

## ElevatedGroup

Premium panel with **raised** shadow. Optional `accentEdge` leading stripe (queues).

## DividerList

Hairline separators inside `ElevatedGroup`.

## SectionHeader

Legacy editorial title; prefer **SectionEyebrow** for new work.

## ReceiptRow

Canonical receipt list row inside `ElevatedGroup` + `DividerList`.

## FilterChip

44pt min-height pill. Active: accent fill (filters) or elevated tile (Ask). Receipts dock + Ask suggestions.

## ModalHeader

Grabber + gradient band + close + `title-lg` on-accent. Ask, Settings modals.

## ScreenHeader

`display-lg` when `large` (Receipts), else `title-lg`. Optional subtitle + trailing.

## Sheet

`radius-3xl` top, warm surface, floating shadow, 50% scrim. `onDismissed` for picker sequencing.

## FAB

56pt circle, accent + **fab** glow elevation.

## Input

Label above → 48pt min → `surface-muted`. Money: LTR, decimal pad.

## PressableScale

Scale 0.98 on press; plain `Pressable` when Reduce Motion.

## LoadingSkeleton

Pulse on `surface-muted`; static when Reduce Motion.

## EmptyState

Icon, title, body, single primary CTA.

## StatusChip

24pt pill, status fg on tint bg.

## Primitive ↔ token map

| Primitive | Key tokens |
|-----------|------------|
| Button primary | accent gradient, on-accent text |
| HeroSurface | accent-gradient, raised shadow |
| Surface featured/dock | surface-elevated / surface-inset, raised/floating |
| FilterChip | accent, surface-muted |
| ModalHeader | hero gradient, on-accent text |
| FAB | accent, fab elevation |

## Theme hooks

| Hook | Use |
|------|-----|
| `useIconColors()` | Ionicons / ActivityIndicator |
| `useTheme()` | Tab bar, placeholders |
| `useReducedMotion()` | Disable orb, scale, skeleton pulse |

Fonts load via `useAppFonts` in `AppProviders` (Outfit + Plus Jakarta Sans).
