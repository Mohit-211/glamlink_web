// Background configuration for sections with multiple areas
export interface SectionBackgroundConfig {
  main?: string;           // Main/outer wrapper background (color, gradient, or Tailwind class)
  [key: string]: string | undefined; // Allow any sub-section backgrounds
}