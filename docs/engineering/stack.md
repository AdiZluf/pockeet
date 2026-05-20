# Tech stack

Locked for MVP unless [decisions](decisions.md) records a change.

## Mobile

| Layer | Choice |
|-------|--------|
| Framework | **Expo SDK 54** (managed, New Architecture) |
| Language | **TypeScript ~5.9** |
| Navigation | **expo-router 6** |
| Styling | **NativeWind v4** + semantic tokens (`src/theme/`, `useTheme`, `useIconColors`) |
| Animation | reanimated + gesture-handler; `useReducedMotion` for a11y |
| Forms | react-hook-form + zod |
| Local DB | expo-sqlite + **Drizzle** |
| Server state | TanStack Query |
| Ephemeral | Zustand |
| i18n | expo-localization + i18next |
| Images | expo-image, expo-image-manipulator |
| Camera | expo-camera |

## Backend (recommended)

| Layer | Choice |
|-------|--------|
| BaaS | **Supabase** — Auth, Postgres, Storage, RLS |
| Jobs | Supabase **Edge Function** `parse-receipt` |
| OCR | Google Document AI *or* AWS Textract |
| Structure | OpenAI / Claude + JSON schema |

## Tooling (post-beta)

| Tool | When |
|------|------|
| EAS Build / Submit | TestFlight / Play internal |
| Sentry | External testers |
| PostHog | After closed beta |

## Not in MVP

PowerSync, WatermelonDB, Redux, on-device OCR, custom sync engine, Tamagui (if NativeWind chosen).

## Repo entry

[app-structure](app-structure.md)
