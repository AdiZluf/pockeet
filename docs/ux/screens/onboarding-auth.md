# Onboarding & auth

**Routes:** `(auth)/onboarding`, `(auth)/login`  
**Purpose:** Orient user, request camera permission, establish identity.

## Onboarding (2 screens)

1. **Value** — what Pockeet does; single CTA “Get started”
2. **Camera** — why camera access; request permission → login or tabs if already authed

**Excluded MVP:** long carousels, account creation forms.

## Login

- **Apple** + **Google** (Supabase Auth)
- No password / magic link in MVP
- Success → tab shell (Home)

## Post-login

Empty Home may highlight FAB; do not force immediate scan.

## Related

[navigation.md](../navigation.md) · [mvp-scope](../../product/mvp-scope.md)
