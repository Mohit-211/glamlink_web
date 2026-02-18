/**
 * Plain Pages Configuration
 *
 * Pages in this list will render with ONLY MainWrapper (no nav, no footer).
 *
 * This provides a minimal layout for pages that need to be standalone,
 * such as embedded content, digital business cards, or full-screen experiences.
 *
 * Matching Logic:
 * - Exact match: pathname === page.pattern (for string patterns)
 * - Pattern match: page.pattern.test(pathname) (for RegExp patterns)
 */

export interface PlainPageConfig {
  pattern: string | RegExp;
  description: string;
}

// Static routes that should NOT be treated as dynamic professional pages
const STATIC_ROUTES = [
  'admin', 'api', 'magazine', 'apply', 'promos', 'login', 'signup',
  'for-professionals', 'for-clients', 'content-settings', 'faqs',
  'privacy', 'terms', 'get-featured', 'get-digital-card', '_next',
  'brand', 'profile', 'image-analysis', 'services'
];

// Build negative lookahead pattern to exclude static routes
const staticRoutesPattern = STATIC_ROUTES.join('|');

export const plainPages: PlainPageConfig[] = [
  {
    // Legacy: /for-professionals/[id] routes (will be deprecated)
    pattern: /^\/for-professionals\/[^/]+$/,
    description: "Professional detail pages (Legacy - Digital Business Cards)"
  },
  {
    // New root-level professional pages: /[cardUrl] (e.g., /betty-smith)
    // Uses negative lookahead to exclude static routes
    pattern: new RegExp(`^\\/(?!(${staticRoutesPattern})(\\/|$))[^/]+$`),
    description: "Professional detail pages (Digital Business Cards)"
  },
  {
    // Professional edit pages: /[cardUrl]/edit (e.g., /betty-smith/edit)
    pattern: new RegExp(`^\\/(?!(${staticRoutesPattern})(\\/|$))[^/]+\\/edit$`),
    description: "Professional edit pages (magic link access)"
  },
];

/**
 * Check if the current pathname should use plain layout
 * (MainWrapper only, no navigation, footer, or alerts)
 *
 * @param pathname - The current pathname from usePathname()
 * @returns true if the page should use plain layout
 */
export function isPlainPage(pathname: string | null): boolean {
  if (!pathname) return false;

  return plainPages.some(page => {
    if (typeof page.pattern === 'string') {
      // Exact string match
      return pathname === page.pattern;
    } else {
      // RegExp pattern match
      return page.pattern.test(pathname);
    }
  });
}
