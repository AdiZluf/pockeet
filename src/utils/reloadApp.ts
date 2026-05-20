import { DevSettings } from "react-native";

/**
 * Full JS reload — required after I18nManager LTR ↔ RTL changes.
 * Call only when `needsRtlReload(locale)` is true; bootstrap uses `rtl_reload_pending`
 * so this runs at most once per direction transition.
 */
export function reloadApp(): void {
  DevSettings.reload();
}
