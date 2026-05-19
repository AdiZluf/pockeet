# Technical decisions

ADR-style log. **Decide now** vs **keep simple** for MVP velocity.

## Locked (decide now)

| Decision | Choice | Why |
|----------|--------|-----|
| Money | `amountMinor` + `currencyCode` | Precision, i18n |
| Receipt status | draft → processing → needs_review → ready \| failed | UI states |
| Local truth | SQLite on device | Speed, offline capture |
| Multi-image | Receipt 1:N images, `sortOrder` | Long receipts |
| Auth | Supabase; Apple + Google | Fast, secure |
| Parse | Cloud OCR + LLM behind interface | Hebrew quality |
| Categories | Fixed taxonomy ~10–12 | Ship speed |
| Tokens | Semantic theme in code | Dark/rebrand later |
| RTL | Logical layout day 1 | Hebrew not retrofit |
| UI kit | NativeWind + primitives | Velocity + consistency |

## Intentionally simple (MVP)

| Area | MVP | Upgrade when |
|------|-----|--------------|
| Sync | Upload queue + poll | Multi-device pain |
| Analytics | `recomputeMonthStats()` local | Perf / multi-device |
| Merchant | string field | Normalization needed |
| Search | none | Users have volume |
| Insights tab | chart on Home only | Trend demand |
| Conflicts | last-write-wins | >10% multi-device |
| Parse delivery | HTTP poll 2.5s | Scale/battery |
| Errors | logs; Sentry at beta | External testers |
| Dark mode | tokens only | v1.1 |

## Open (confirm before scaffold)

| Topic | Default | Notes |
|-------|---------|-------|
| GTM | Israel + global EN | ILS default for `he` |
| OCR vendor | Google Document AI | Hebrew corpus test early |
| UI library | NativeWind v4 | Don’t mix Tamagui |

## Rejected for MVP

- Generic sync (PowerSync, CRDT)
- Realtime parse subscriptions
- Materialized analytics triggers
- Feature flag service
- Multiple chart types on Home
- Password / magic link auth

## Changing a decision

1. Update this file with date + rationale.
2. Update affected docs (architecture, mvp-scope).
3. Migration plan if code exists.
