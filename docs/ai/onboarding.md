# Onboarding guide

Welcome to Pockeet. Read time ~30 minutes for full context; **15 minutes** for builders.

## Day 1 — Everyone

| Order | Doc | Why |
|-------|-----|-----|
| 1 | [vision](../product/vision.md) | What we’re building |
| 2 | [mvp-scope](../product/mvp-scope.md) | What ships now |
| 3 | [ux/principles](../ux/principles.md) | How it should feel |
| 4 | [navigation](../ux/navigation.md) | Routes and flows |

## Designers

| Doc | Why |
|-----|-----|
| [visual-identity](../design/visual-identity.md) | Brand and anti-patterns |
| [tokens](../design/tokens.md) | Figma variables 1:1 |
| [screens/README](../ux/screens/README.md) | Per-screen specs |
| [accessibility](../accessibility/README.md) | Contrast, motion, SR |

**Figma:** mirror semantic token names from `tokens.md`.

## Engineers

| Doc | Why |
|-----|-----|
| [architecture](../engineering/architecture.md) | System shape |
| [decisions](../engineering/decisions.md) | What’s locked vs deferred |
| [data-model](../engineering/data-model.md) | Schema |
| [parse-pipeline](../engineering/parse-pipeline.md) | OCR/LLM flow |
| [stack](../engineering/stack.md) | Libraries |
| [app-structure](../engineering/app-structure.md) | Folders |
| [components](../design/components.md) | UI primitives |
| [cursor-rules](cursor-rules.md) | AI + code rules |

## AI context pack (minimal)

For Cursor/LLM sessions, attach or @-reference:

```
docs/product/mvp-scope.md
docs/ux/navigation.md
docs/design/tokens.md
docs/design/components.md
docs/engineering/decisions.md
docs/ai/cursor-rules.md
```

Add screen-specific `docs/ux/screens/<name>.md` when implementing a flow.

Cursor loads [.cursor/rules/pockeet.mdc](../../.cursor/rules/pockeet.mdc) automatically; full rules in [cursor-rules](cursor-rules.md).

## FAQ

**Where’s the single master doc?** There isn’t one — use [docs/README.md](../README.md) as the index.

**Can I add a feature not in MVP?** Propose in [roadmap](../product/roadmap.md) first; don’t implement without approval.

**Hebrew testing?** Required for any layout PR — largest dynamic type + VoiceOver HE.

**Dark mode?** Tokens exist; UI ships v1.1.

## Contacts / decisions

Log architecture changes in [engineering/decisions.md](../engineering/decisions.md).
