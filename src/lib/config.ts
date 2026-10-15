/**
 * Public runtime configuration from NEXT_PUBLIC_* environment variables
 * (documented in .env.example).
 *
 * Next.js inlines NEXT_PUBLIC_* values at build time, so each one must be
 * read by its full literal name — never via process.env[someKey].
 * next.config.ts fails the production build when a required one is missing.
 */

const withoutTrailingSlash = (url: string) => url.replace(/\/+$/, "");

/** Public origin of this site, for canonical URLs, Open Graph and structured data. */
export const SITE_URL = withoutTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
);

/** Backend API base URL, e.g. https://node.glamlink.net/api/v1 */
export const API_URL = withoutTrailingSlash(process.env.NEXT_PUBLIC_API_URL || "");

/** Origin of the backend, which also serves uploaded files under /images. */
export const API_ORIGIN = API_URL ? new URL(API_URL).origin : "";

/** Builds a backend URL with exactly one slash between the base and the path. */
export const apiUrl = (path: string) => `${API_URL}/${path.replace(/^\/+/, "")}`;

/** Google Tag Manager container. Leave unset outside production to keep analytics clean. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

/** Google AdSense publisher ID. Leave unset outside production; ads only run on the live domain. */
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
