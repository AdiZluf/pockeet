# App structure

Target layout — **foundations scaffolded** in repo. Routes stay thin; logic in `features/` and `services/`.

**Current state:** `(tabs)/index` runs `FoundationPlayground`; product routes (`capture/`, `receipt/`, etc.) are not added until the next phase.

```
pockeet/
├── app/                      # expo-router
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── index.tsx         # Home
│   │   └── receipts.tsx
│   ├── capture/
│   │   ├── index.tsx
│   │   └── preview.tsx
│   ├── receipt/
│   │   └── [id]/
│   │       ├── index.tsx     # detail
│   │       ├── review.tsx
│   │       └── processing.tsx
│   ├── needs-review.tsx
│   └── _layout.tsx
├── src/
│   ├── components/ui/        # Button, Card, Input, Sheet, ListRow, …
│   ├── features/
│   │   ├── capture/
│   │   ├── review/
│   │   ├── home/
│   │   ├── receipts/
│   │   ├── ask/
│   │   └── settings/
│   ├── ask.tsx                 # Ask Pockeet modal (MVP+)
│   ├── db/
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── repositories/
│   ├── services/
│   │   ├── api/
│   │   ├── sync/
│   │   └── parse/
│   ├── theme/                # tokens — see design/tokens.md
│   ├── i18n/
│   │   └── locales/en.json
│   └── utils/                # money, dates
├── supabase/
│   └── functions/parse-receipt/
├── docs/                     # this documentation
└── app.config.ts
```

## Import rules

- `app/**` → `features`, `components/ui`, `services` — not reverse.
- `features/*` → `components/ui`, `db`, `services` — **not** other features.
- `components/ui` → `theme` only — no feature imports.
- No hex in `app/` or `features/`.

## Related

- [architecture](architecture.md)
- [stack](stack.md)
- [components](../design/components.md)
