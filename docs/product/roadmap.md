# Roadmap

Post-MVP sequencing. **MVP boundaries are fixed in [mvp-scope](mvp-scope.md)** — this file is for planning only.

## v1.0 — MVP (current target)

See [mvp-scope](mvp-scope.md).

## v1.1 — Quality & habit

- Insights tab (3-month category trends)
- Search (SQLite FTS) + saved filter presets
- Dark mode UI (tokens already defined)
- Duplicate receipt hints
- Merchant logos (static pack or API)
- Page reorder on capture preview
- Widget: quick scan
- PostHog + Sentry in production
- Delete-account UI

## v1.2 — Budgets

- Monthly budget per category
- Gentle alerts (opt-in, non-naggy)

## v2.0 — Household & export

- Shared pocket (couple/family)
- CSV/PDF export
- Email-in receipts

## v2.5 — Intelligence

- Recurring spend detection
- Natural language Q&A over spending
- Smarter categories (embeddings)
- Price memory per normalized SKU

## v3.0 — Platform

- Web dashboard
- Accountant / tax modes
- Regional tax rules
- API for partners

## Technical evolution (parallel)

| Trigger | Upgrade |
|---------|---------|
| Multi-device usage | Bidirectional sync + conflict UI |
| Parse cost | Image-hash dedupe, regional OCR |
| List perf | Server rollups, WatermelonDB if needed |
| Scale | Job queue, separate workers, CDN |

## Monetization (not MVP)

| Tier | Value |
|------|--------|
| Free | Limited scans, basic analytics |
| Plus | Unlimited scans, export, budgets |
| Pro | Household, tax packs, advanced insights |

Schema/feature flags only in MVP — no paywall UI.
