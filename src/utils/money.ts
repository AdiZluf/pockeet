import type { TextStyle } from "react-native";

/** Locale for Intl currency formatting (English-only MVP). */
export const MONEY_LOCALE = "en-US";

/**
 * Format minor units (agorot/cents) for display. Always LTR in UI.
 */
export function formatMoney(
  amountMinor: number,
  currencyCode: string,
  locale: string = MONEY_LOCALE,
): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function parseMoneyInput(value: string): number | null {
  const normalized = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed * 100);
}

/** LTR writing direction for money and numeric fields. */
export const moneyWritingProps = {
  writingDirection: "ltr" as const,
  style: { writingDirection: "ltr" as const },
};

/** Money in list trailing column: LTR digits, right-aligned. */
export const moneyTextProps = {
  ...moneyWritingProps,
  style: {
    ...moneyWritingProps.style,
    textAlign: "right" as const,
  },
};

/** TextInput alignment for English forms. */
export const textInputAlignStyle: TextStyle = { textAlign: "left" };
