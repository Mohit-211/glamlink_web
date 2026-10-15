/**
 * Design tokens as hex, for the few places that cannot read CSS variables:
 * Stripe Elements (styled inside Stripe's iframe), canvas drawing and chart
 * series colours. Values mirror the HSL tokens in src/styles/globals.css —
 * change both together.
 */
export const TOKENS = {
  primary: "#24BBCB",
  accentForeground: "#156F79",
  background: "#F9F8F6",
  card: "#FDFDFC",
  foreground: "#1F242E",
  mutedForeground: "#616875",
  border: "#E1DFDB",
  destructive: "#DC2828",
} as const;
