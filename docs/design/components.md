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

## Card

| Variant | Spec |
|---------|------|
| flat | `surface`, `radius-lg`, pad `space-4` |
| interactive | full-surface press; optional hairline border |

Max **2** nested cards per screen section. No shadow unless spec says otherwise.

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

## Section

Optional `font-title-md` + `space-6` top (first section `space-4`).

## EmptyState

Icon 64pt, title, body, single primary CTA.

## LoadingSkeleton

Match final geometry; `surface-muted`; hide from AT (`importantForAccessibility=no`).  
Parent region `busy` when loading.

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
| StatusChip | status-* fg/bg |

## Storybook (post-scaffold)

Visual regression for all variants in EN + HE RTL — week 1 after scaffold.
