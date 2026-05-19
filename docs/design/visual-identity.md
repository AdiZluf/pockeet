# Visual identity

**North star:** “Calm clarity in your pocket.”

Exact values → [tokens](tokens.md). Components → [components](components.md).

## Emotional target

| Feel | Expression |
|------|------------|
| Calm | Whitespace, one focal point per screen |
| Trustworthy | Honest states, predictable patterns |
| Premium | Restraint — every element earns its place |
| Warm minimal | Warm neutrals; human copy |
| Fast | Light UI weight; skeletons over spinners |

## Defining characteristics

1. **Typography-led money** — hero totals are the brand moment.
2. **Muted depth** — borders/tonal steps before shadows.
3. **Accent discipline** — pocket teal `#1F6F78` on actions only (~≤8% of Home pixels).
4. **Category color = meaning** — not decoration.
5. **Abstract paper/pocket** — soft surfaces; no clipart receipts.

## vs generic budgeting apps

| Avoid | Pockeet |
|-------|---------|
| Widget dashboards | One story per screen |
| Red/green panic totals | Neutral hero + muted delta chip |
| Neon / coin icons | Matte surfaces, typographic money |
| Many charts | **Max 1** chart on Home |

## Hierarchy

Amount → time → merchant/category → metadata → chrome.  
Weight/size before color.

## Cards & elevation

- Cards group content — not every row.
- Shadow: **FAB, sheets, capture bar only** — see [tokens](tokens.md#elevation).
- Home hero: open canvas, not heavy card.

## Charts

One type for MVP (horizontal bars **or** donut — pick one).  
Flat fills, labels + values, tap = navigate. No chartjunk.

## Motion

Quiet, assured — 100–320ms; no bounce/parallax.  
Respect reduce motion — [accessibility](../accessibility/README.md#motion).

| Moment | Duration |
|--------|----------|
| Tab | 200ms |
| Push | 300ms |
| Sheet | 320ms low-bounce spring |

## Inspiration (principles only)

| Product | Take |
|---------|------|
| Copilot Money | Calm monthly story, total typography |
| Revolut | Spacing, clear primaries |
| Linear | Hierarchy discipline |
| Notion | Warm surfaces, friendly empties |
| Apple Wallet / iOS Settings | Trust, grouped lists |

## Anti-patterns

Dashboard grids · crypto neon · spreadsheet tables · gamification · multiple charts · shame banners · glassmorphism stacks · stock coin art · pure #000/#FFF · AI sparkle clutter.

## Dark mode

Tokens defined; ship light MVP — [tokens](tokens.md#dark-mode). UI in v1.1 per [roadmap](../product/roadmap.md).

## Consistency governance

- No new colors without semantic role.
- No one-off spacing — use scale only.
- RTL screenshot on layout PRs.
- Implementation limits: [implementation-constraints](implementation-constraints.md).
- Per-feature checklist in [ai/cursor-rules](../ai/cursor-rules.md).
