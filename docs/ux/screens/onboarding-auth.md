# Onboarding & auth

**Routes:** `/(auth)/onboarding`, `/(auth)/login`  
**Entry:** `app/index.tsx` resolves launch route from SQLite `app_preferences`.

## First launch

1. **Onboarding** (3 slides) — scan, AI organization, monthly clarity
2. **Auth entry** — Apple / Google placeholders (alert: coming soon), **Continue as guest** → tabs
3. **Home** — normal local MVP experience

Skip on slides 1–2 jumps to auth entry. **Get started** on slide 3 marks onboarding complete and opens auth.

## Persistence

| Key | Value | Meaning |
|-----|-------|---------|
| `onboarding_completed` | `1` | User finished or skipped onboarding |
| `auth_session` | `guest` | Guest entry completed (real local flow) |

Stored in `app_preferences` (SQLite). No Supabase/auth backend in MVP.

## Return launches

- Both prefs set → `/(tabs)` directly
- Onboarding done, no auth → `/(auth)/login`
- Neither → `/(auth)/onboarding`

## Dev

Home dev banner: **Reset onboarding** clears prefs and `replace` → onboarding.

## Related

[navigation.md](../navigation.md) · [mvp-scope](../../product/mvp-scope.md)
