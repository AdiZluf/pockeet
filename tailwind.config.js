/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          muted: "var(--color-surface-muted)",
          elevated: "var(--color-surface-elevated)",
        },
        foreground: {
          DEFAULT: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          inverse: "var(--color-text-inverse)",
        },
        border: {
          DEFAULT: "var(--color-border-default)",
          subtle: "var(--color-border-subtle)",
          focus: "var(--color-border-focus)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          muted: "var(--color-accent-muted)",
          soft: "var(--color-accent-soft)",
          glow: "var(--color-accent-glow)",
          hover: "var(--color-accent-hover)",
        },
        overlay: "var(--color-overlay)",
        status: {
          processing: {
            DEFAULT: "var(--status-processing-fg)",
            bg: "var(--status-processing-bg)",
          },
          review: {
            DEFAULT: "var(--status-review-fg)",
            bg: "var(--status-review-bg)",
          },
          ready: {
            DEFAULT: "var(--status-ready-fg)",
            bg: "var(--status-ready-bg)",
          },
          failed: {
            DEFAULT: "var(--status-failed-fg)",
            bg: "var(--status-failed-bg)",
          },
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
          6: "var(--chart-6)",
          7: "var(--chart-7)",
          8: "var(--chart-8)",
        },
      },
      spacing: {
        0: "0px",
        0.5: "2px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "32px",
        8: "40px",
        9: "48px",
        10: "64px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      fontSize: {
        "display-xl": ["40px", { lineHeight: "48px", fontWeight: "500" }],
        "display-lg": ["32px", { lineHeight: "40px", fontWeight: "500" }],
        "title-lg": ["22px", { lineHeight: "28px", fontWeight: "600" }],
        "title-md": ["20px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["17px", { lineHeight: "24px", fontWeight: "400" }],
        body: ["16px", { lineHeight: "22px", fontWeight: "400" }],
        "body-sm": ["15px", { lineHeight: "21px", fontWeight: "400" }],
        label: ["14px", { lineHeight: "20px", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
        micro: ["11px", { lineHeight: "16px", fontWeight: "500" }],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        fab: "var(--shadow-fab)",
        sheet: "0px 8px 24px rgba(28, 25, 23, 0.12)",
        "fab-pressed": "0px 12px 32px rgba(31, 111, 120, 0.32)",
      },
      letterSpacing: {
        tight: "-0.3px",
        wide: "0.4px",
      },
    },
  },
  plugins: [],
};
