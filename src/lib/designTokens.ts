/**
 * Design tokens as hex, for the few places that cannot read CSS variables:
 * Stripe Elements (styled inside Stripe's iframe), canvas drawing and chart
 * series colours. Values mirror the HSL tokens in src/styles/globals.css —
 * change both together.
 */
export const TOKENS = {
  primary: "#16818C",
  secondary: "#117580",
  accentForeground: "#117580",
  background: "#FEFDFB",
  card: "#FFFFFF",
  foreground: "#1F242E",
  muted: "#F0EEEB",
  mutedForeground: "#616875",
  border: "#E1DFDB",
  input: "#D5D2CD",
  destructive: "#DC2828",
} as const;
