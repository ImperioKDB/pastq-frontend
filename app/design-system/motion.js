"use client";
/**
 * PastQ Design System — Motion Tokens
 * Duration and easing values used across all animations.
 * Framer Motion variant presets included for convenience.
 */

export const duration = {
  instant: 100,  // Hover states
  fast:    150,  // Button presses
  normal:  250,  // Modals, dropdowns
  slow:    400,  // Hero animations
  slower:  600,  // Page entrances
};

export const easing = {
  easeOut:     "cubic-bezier(0.16, 1, 0.3, 1)",
  easeInOut:   "cubic-bezier(0.76, 0, 0.24, 1)",
  spring:      "cubic-bezier(0.34, 1.56, 0.64, 1)",
  decelerate:  "cubic-bezier(0, 0, 0.2, 1)",
  accelerate:  "cubic-bezier(0.4, 0, 1, 1)",
};

// Framer Motion variants
export const fadeInUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing.easeOut } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: easing.easeOut } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: easing.spring } },
};

export const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

export const staggerItem = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easing.easeOut } },
};
