# Screen specifications (MVP)

Wireframe-level specs. Shared conventions below; each screen has its own file.

## Global conventions

| Topic | Rule |
|-------|------|
| Gutter | 20pt (`space-5`) |
| Money | Locale formatted; **LTR** even in HE |
| Loading | Skeletons, not spinners (except camera/auth) |
| Errors | Inline + retry; never dead-end |
| Haptics | Capture snap; “Looks good” success |

## Screens

| # | Screen | File |
|---|--------|------|
| 1 | Home | [home.md](home.md) |
| 2 | Capture / Scan | [capture.md](capture.md) |
| 3 | Processing | [processing.md](processing.md) |
| 4 | Review / Edit | [review.md](review.md) |
| 5 | Needs-review queue | [needs-review.md](needs-review.md) |
| 6 | Receipts list | [receipts-list.md](receipts-list.md) |
| 7 | Receipt detail | [receipt-detail.md](receipt-detail.md) |
| — | Onboarding & auth | [onboarding-auth.md](onboarding-auth.md) |
| — | Settings | [settings.md](settings.md) |

## Status → routes

See [navigation.md](../navigation.md#routes).
