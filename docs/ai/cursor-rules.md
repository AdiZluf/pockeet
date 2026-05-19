# Cursor / AI agent rules

Instructions for AI assistants working in this repo. Humans: see [onboarding](onboarding.md).

## Before writing code

1. Read [docs/README.md](../README.md) and [mvp-scope](../product/mvp-scope.md).
2. For UI: [tokens](../design/tokens.md) + [components](../design/components.md) + [accessibility](../accessibility/README.md).
3. For features: relevant [screen spec](../ux/screens/README.md) + [navigation](../ux/navigation.md).

## Product invariants

- **Loop:** scan → local save → parse → review → monthly Home story.
- **Capture never blocks on network.**
- **One Review surface** for all edits; detail is read-only.
- **Max 1 chart** on Home; no Insights tab in MVP.
- **EN + HE + RTL** — logical layout; money LTR.
- **No financial shame UI** — neutral totals, muted deltas.

## Code constraints

| Rule | Detail |
|------|--------|
| Tokens only | No raw hex in `app/`, `features/` |
| Spacing scale | Only `space-*` from [tokens](../design/tokens.md) |
| Primitives | Compose `components/ui/*`; don’t duplicate Button/Row styles |
| Feature isolation | No `features/a` importing `features/b` |
| Money | `amountMinor` + `currencyCode` |
| Receipt status | Use enum; don’t invent parallel state |
| Accent budget | ≤1 prominent accent region per screen |
| Touch targets | 44pt min; primary button 52pt |
| a11y defaults | Labels on icon buttons; skeleton parent `busy` |

## Implementation order (greenfield)

1. `theme/` + primitives (Button, ListRow, …)
2. SQLite schema + repos
3. i18n EN/HE + RTL
4. Capture (local) → parse → review → home

Match [mvp-scope build order](../product/mvp-scope.md#build-order) (week 1–6 table).

## When unsure

- Scope question → [mvp-scope](../product/mvp-scope.md) then [roadmap](../product/roadmap.md)
- UX question → [principles](../ux/principles.md) + screen spec
- Visual question → [visual-identity](../design/visual-identity.md)
- Architecture → [decisions](../engineering/decisions.md)

**Do not** expand MVP scope without explicit user request.

## PR / doc hygiene

- UI changes: note EN + HE RTL screenshot expectation.
- Token changes: mention contrast check.
- Update docs if behavior diverges from specs.

## Anti-patterns (reject in review)

- Dashboard widget grids, extra charts, search in MVP
- Redux, second styling system, hex in features
- Blocking capture on upload/parse
- Separate accessibility-only layouts
- `allowFontScaling={false}` globally
