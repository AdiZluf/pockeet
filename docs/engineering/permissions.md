# Permissions (MVP)

Pockeet requests the minimum native permissions required for receipt capture.

## Requested at runtime

| Permission | When | Module |
|------------|------|--------|
| Camera | User opens capture and taps **Allow camera** | `expo-camera` |
| Photo library | User taps **Choose from gallery** on capture | `expo-image-picker` |

No permission prompts on app launch or on Home/Receipts tabs.

## Not used (explicitly disabled in `app.json` plugins)

| Permission | Why disabled |
|------------|----------------|
| Microphone | Receipt scan is photo-only; `microphonePermission: false` on camera + image-picker |
| Motion / activity / fitness | Not in dependencies; no `NSMotionUsageDescription` |
| Location / tracking | Not used |
| Health | Not used |

## Reduce Motion (not a permission)

`useReducedMotion()` reads iOS/Android accessibility settings via `AccessibilityInfo` — no system permission dialog.

## Rebuild after `app.json` changes

Plugin permission flags apply on the next **prebuild / native build**. Expo Go may still show permissions from its own binary until you use a dev build with updated config.
