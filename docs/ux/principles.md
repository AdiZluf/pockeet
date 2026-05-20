# UX principles

How Pockeet should **feel** in use. Visual rules: [visual-identity](../design/visual-identity.md). Screen specs: [screens](screens/README.md).

## Experience target

**Copilot Money calm + Apple Camera clarity + Revolut action confidence** — without neon fintech or spreadsheet density.

## Hierarchy (every screen)

1. **Amount** (display type)
2. **Time** (month, date)
3. **Merchant / category**
4. **Metadata / status**
5. **Chrome** (tabs, nav) — quietest

Prefer **size and weight** over color for hierarchy.

## Critical paths

### Scan → trust

| Phase | UX |
|-------|-----|
| Capture | Haptic snap; instant save; never wait on network |
| Multi-page | Normal; up to 5 pages; filmstrip |
| Processing | Honest copy; can continue in background |
| Review | Hero screen — not an error state |
| Confirm | “Looks good” → Home (`replace`, not back through processing) |

### Review (correction UX)

- Merchant, date, total: large tap targets.
- Line items: inline edit, swipe delete, + Add.
- Low confidence: dotted underline or thin accent — **not** full-screen warning.
- CTAs: **“Looks good”** (primary), **“Fix later”** (secondary → `needs_review`).
- One edit surface: [review screen](screens/review.md); detail is read-only.

### Monthly story (Home)

- One question: “How am I doing **this month**?”
- One chart max; tap category row → Receipts with month + category filter.
- Needs-review banner only if count &gt; 0.

## Copy tone

- Warm, short, neutral about money (“this month **so far**”, not “you already spent”).
- EN + HE from day one; receipt text stays as scanned.
- Status labels: see [navigation](navigation.md#status-copy).

## Error handling (user-facing)

| Failure | User sees |
|---------|-----------|
| Camera denied | Rationale + Settings link |
| Offline | “Saved — will analyze when online” |
| Parse fail | Retry + Enter manually |
| Low confidence | Needs-review queue |

## Deferred UX (not MVP)

Edge guides, blur detection, FTS search, Insights tab, duplicate warnings, subtotal/tax fields, real LLM insight cards, budget rings.

## i18n / RTL (summary)

Mirror **flow** (tabs, FAB, chevrons); not **numbers** or chart readability.  
Details: [design/layout.md](../design/layout.md#rtl), [accessibility](../accessibility/README.md#rtl).

## Related

- [navigation.md](navigation.md)
- [mvp-scope](../product/mvp-scope.md)
