import { SITE_URL } from "@/lib/config";
import type { MetadataRoute } from "next";
import { ALLOW_INDEXING } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  // Test and staging builds: keep every crawler out, and point at no sitemap.
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
