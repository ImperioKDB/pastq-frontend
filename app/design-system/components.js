"use client";
/**
 * PastQ Design System — Component Primitives
 * Reusable style objects for buttons, cards, inputs, and tags.
 * Use these instead of writing ad-hoc inline styles on every page.
 */

import { colors, spacing, typography, radii, shadows } from "./tokens";

export const buttonStyles = {
  primary: {
    background:  colors.brand.primary,
    color:       colors.bg.base,
    padding:     `${spacing[3]} ${spacing[5]}`,
    borderRadius: radii.md,
    fontWeight:  700,
    fontSize:    typography.size.sm,
    border:      "none",
    cursor:      "pointer",
    fontFamily:  typography.font.body,
    boxShadow:   shadows.glow,
    transition:  "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  secondary: {
    background:   "transparent",
    color:        colors.text.primary,
    padding:      `${spacing[3]} ${spacing[5]}`,
    borderRadius: radii.md,
    fontWeight:   600,
    fontSize:     typography.size.sm,
    border:       `1px solid ${colors.border.default}`,
    cursor:       "pointer",
    fontFamily:   typography.font.body,
    transition:   "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  ghost: {
    background:   "transparent",
    color:        colors.text.secondary,
    padding:      `${spacing[2]} ${spacing[3]}`,
    borderRadius: radii.sm,
    fontWeight:   500,
    fontSize:     typography.size.sm,
    border:       "none",
    cursor:       "pointer",
    fontFamily:   typography.font.body,
    transition:   "color 150ms ease",
  },
};

export const cardStyles = {
  default: {
    background:   colors.bg.elevated,
    border:       `1px solid ${colors.border.subtle}`,
    borderRadius: radii.lg,
    padding:      spacing[5],
    transition:   "border-color 200ms ease, box-shadow 200ms ease",
  },
  interactive: {
    background:   colors.bg.elevated,
    border:       `1px solid ${colors.border.subtle}`,
    borderRadius: radii.lg,
    padding:      spacing[5],
    cursor:       "pointer",
    transition:   "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

export const inputStyles = {
  default: {
    width:        "100%",
    padding:      `${spacing[3]} ${spacing[4]}`,
    borderRadius: radii.sm,
    border:       `1px solid ${colors.border.default}`,
    background:   colors.bg.base,
    color:        colors.text.primary,
    fontSize:     typography.size.sm,
    fontFamily:   typography.font.body,
    outline:      "none",
    transition:   "border-color 200ms ease, box-shadow 200ms ease",
  },
};

export const tagStyles = {
  default: {
    padding:       `${spacing[1]} ${spacing[2]}`,
    borderRadius:  radii.sm,
    fontSize:      typography.size.xs,
    fontFamily:    typography.font.mono,
    fontWeight:    500,
    letterSpacing: typography.tracking.wide,
    background:    colors.bg.elevated,
    color:         colors.text.secondary,
    border:        `1px solid ${colors.border.subtle}`,
  },
  brand: {
    padding:       `${spacing[1]} ${spacing[2]}`,
    borderRadius:  radii.sm,
    fontSize:      typography.size.xs,
    fontFamily:    typography.font.mono,
    fontWeight:    500,
    letterSpacing: typography.tracking.wide,
    background:    colors.brand.primaryMuted,
    color:         colors.brand.primary,
    border:        `1px solid ${colors.brand.primaryGlow}`,
  },
};

export const focusRing = {
  outline:       `2px solid ${colors.brand.primary}`,
  outlineOffset: "3px",
  borderRadius:  radii.sm,
};
