# Pockeet

Mobile app for scanning receipts and understanding monthly spending — calm, premium, bilingual (EN/HE).

## Documentation

All product, design, and engineering specs live in **[`docs/`](docs/README.md)** (30 files, cross-linked).

| Audience | Start here |
|----------|------------|
| Builders | [mvp-scope](docs/product/mvp-scope.md) → [navigation](docs/ux/navigation.md) → [tokens](docs/design/tokens.md) |
| Design | [visual-identity](docs/design/visual-identity.md) → [screens](docs/ux/screens/README.md) |
| AI / Cursor | [AGENTS.md](AGENTS.md) · [cursor-rules](docs/ai/cursor-rules.md) |

See [CONTRIBUTING.md](CONTRIBUTING.md) for PR expectations.

## Development

```bash
npm install
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run typecheck
```

**Foundation app:** Home tab shows the UI primitives playground (not product screens). Receipt flows are not implemented yet.

## Status

**Foundations scaffolded** — Expo SDK 54, expo-router 6, NativeWind, theme tokens, i18n/RTL, SQLite/Drizzle, UI primitives. See [app structure](docs/engineering/app-structure.md).
