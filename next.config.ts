// next.config.ts
import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { indexingAllowed } from "./src/lib/indexing";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/** Variables the site cannot be built without. The rest are optional; see .env.example. */
const REQUIRED_ENV = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_API_URL"] as const;

/** Allows next/image to load anything served from the origin of `url`. */
function originPattern(url: string | undefined): RemotePattern[] {
  if (!url) return [];
  const { protocol, hostname, port } = new URL(url);
  return [
    {
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      port,
      pathname: "/**",
    },
  ];
}

export default function nextConfig(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. Copy .env.example to .env and fill them in.`
      );
    }
  }

  return {
    // Test and staging builds (SITE_INDEXING=off, or any address other than
    // glamlink.net): every response tells crawlers not to index or follow.
    async headers() {
      if (indexingAllowed()) return [];
      return [
        {
          source: "/:path*",
          headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
        },
      ];
    },
    images: {
      remotePatterns: [
        // The site itself and the backend (uploaded images live under its /images path).
        ...originPattern(process.env.NEXT_PUBLIC_SITE_URL),
        ...originPattern(process.env.NEXT_PUBLIC_API_URL),
        // Google Places photos for directory providers.
        { protocol: "https", hostname: "maps.googleapis.com" },
      ],
    },
  };
}
