# Settings

**Route:** modal from Home gear  
**Purpose:** Locale preferences and sign out.

## Fields (MVP)

| Setting | Options |
|---------|---------|
| Language | English / עברית — persisted in SQLite; **one** app reload when LTR↔RTL changes (guarded by `rtl_reload_pending`) |
| Currency | ILS / USD (default display) |
| Sign out | confirm optional |

## Excluded MVP

Delete account UI (API stub only), notifications, theme/dark toggle (v1.1).

## a11y

Full-size rows 56pt min; labels + current value announced.

## Related

[tokens](../../design/tokens.md) · [layout](../../design/layout.md)
