# Implementation constraints

Enforce via code review + [cursor-rules](../ai/cursor-rules.md). Philosophy: [visual-identity](visual-identity.md).

| Rule | Constraint |
|------|------------|
| Charts per screen | **1** on Home only |
| Accent | ≤1 filled accent region per viewport |
| Cards | ≤2 grouped cards per section; lists use ListRow |
| Spacing | Token scale only; gutter `space-5` (20) |
| Animation | 100–320ms; ≤2 simultaneous; no infinite except indeterminate parse |
| Display XL | **1** per screen |
| Primary CTA | **1** per viewport bottom |
| Font families | ≤2 (UI + display) |
| Shadows | Max `elevation-2` on any element |
| Status color | Chips / small text — not full bleeds |
| Touch | 44pt min hit area |
| Icon buttons | `accessibilityLabel` required |
| Imports | No feature → feature |

**When in doubt:** remove an element, add space, soften secondary text.
