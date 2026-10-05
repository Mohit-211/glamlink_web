import type { CSSProperties } from "react";

/** Directory brand color. Scoped to the directory page — the global theme is unchanged. */
export const DIRECTORY_BRAND = "#24bbcb";
export const DIRECTORY_BRAND_DARK = "#1b9aa8";

/**
 * Re-points the theme tokens (`primary`, `accent`, `ring`) at the directory
 * brand color for everything rendered inside the element it's applied to.
 * Also apply it to portaled content (e.g. dialogs), which renders outside the page tree.
 */
export const directoryThemeStyle = {
  "--primary": "186 70% 47%",
  "--color-primary": DIRECTORY_BRAND,
  "--ring": "186 70% 47%",
  "--color-ring": DIRECTORY_BRAND,
  "--accent": "186 70% 95%",
  "--color-accent": "hsl(186 70% 95%)",
  "--accent-foreground": "186 70% 30%",
  "--color-accent-foreground": "hsl(186 70% 30%)",
  "--shadow-primary": "0 4px 20px -4px rgb(36 187 203 / 0.35)",
} as CSSProperties;
