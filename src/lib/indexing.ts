/**
 * Whether search engines may index this deployment (server-side, read at build).
 *
 * SITE_INDEXING=on|off decides it. When it is not set, only the production
 * address (NEXT_PUBLIC_SITE_URL on glamlink.net) is indexed, so a test or
 * staging build (test.glamlink.net, localhost) stays out of search engines even
 * if nobody remembers the setting.
 *
 * When indexing is off, every page says noindex/nofollow (meta tag and the
 * X-Robots-Tag header from next.config.ts), robots.txt disallows everything and
 * the sitemap is empty.
 */
import type { Metadata } from "next";

const PRODUCTION_HOSTS = ["glamlink.net", "www.glamlink.net"];

export function indexingAllowed(env: Record<string, string | undefined> = process.env): boolean {
  const flag = (env.SITE_INDEXING ?? "").trim().toLowerCase();
  if (["on", "true", "1", "yes"].includes(flag)) return true;
  if (["off", "false", "0", "no"].includes(flag)) return false;
  try {
    return PRODUCTION_HOSTS.includes(new URL(env.NEXT_PUBLIC_SITE_URL ?? "").hostname);
  } catch {
    return false;
  }
}

export const ALLOW_INDEXING = indexingAllowed();

/** The robots metadata of a deployment that must stay out of search engines. */
export const NO_INDEX: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

/** A page's own robots rules in production; noindex everywhere else. */
export const pageRobots = (robots: NonNullable<Metadata["robots"]>): NonNullable<Metadata["robots"]> =>
  ALLOW_INDEXING ? robots : NO_INDEX;
