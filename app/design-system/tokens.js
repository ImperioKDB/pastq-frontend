"use client";
/**
 * PastQ Design System — Tokens
 * Single source of truth. Import from here, not from globals.css directly.
 */

export const colors = {
  bg: {
    base:     "#0C0A09",
    elevated: "#1C1917",
    overlay:  "rgba(12, 10, 9, 0.85)",
  },
  text: {
    primary:   "#FAF9F6",
    secondary: "#A8A29E",
    tertiary:  "#78716C",
    inverse:   "#0C0A09",
  },
  brand: {
    primary:       "#D4A017",
    primaryMuted:  "rgba(212, 160, 23, 0.15)",
    primaryGlow:   "rgba(212, 160, 23, 0.25)",
    secondary:     "#1B4D3E",
    accent:        "#E85D4E",
    accentMuted:   "rgba(232, 93, 78, 0.12)",
  },
  semantic: {
    success:      "#22C55E",
    successMuted: "rgba(34, 197, 94, 0.12)",
    error:        "#EF4444",
    errorMuted:   "rgba(239, 68, 68, 0.12)",
    warning:      "#F59E0B",
    warningMuted: "rgba(245, 158, 11, 0.12)",
  },
  border: {
    subtle:  "#292524",
    default: "#44403C",
    strong:  "#57534E",
  },
};

export const spacing = {
  1: "4px",  2: "8px",  3: "12px", 4: "16px",
  5: "24px", 6: "32px", 7: "48px", 8: "64px", 9: "96px",
};

export const typography = {
  font: {
    display: "'Clash Display', 'Cabinet Grotesk', system-ui, sans-serif",
    body:    "'Inter', 'Source Serif 4', system-ui, sans-serif",
    mono:    "'JetBrains Mono', 'Courier New', monospace",
  },
  size: {
    xs: "12px", sm: "14px", base: "16px", lg: "18px",
    xl: "20px", "2xl": "24px", "3xl": "32px", "4xl": "40px",
    "5xl": "48px", "6xl": "64px",
  },
  leading: {
    tight: "1.2", snug: "1.4", normal: "1.6", relaxed: "1.75",
  },
  tracking: {
    tight: "-0.03em", normal: "0", wide: "0.04em", wider: "0.08em",
  },
};

export const radii = {
  none: "0", sm: "6px", md: "10px", lg: "16px", xl: "24px", full: "9999px",
};

export const shadows = {
  sm:         "0 1px 2px rgba(0, 0, 0, 0.3)",
  md:         "0 4px 12px rgba(0, 0, 0, 0.4)",
  lg:         "0 8px 24px rgba(0, 0, 0, 0.5)",
  glow:       "0 0 24px rgba(212, 160, 23, 0.2)",
  glowStrong: "0 0 40px rgba(212, 160, 23, 0.35)",
};

export const zIndex = {
  base: 0, dropdown: 10, sticky: 20,
  overlay: 30, modal: 40, toast: 50, tooltip: 60,
};
