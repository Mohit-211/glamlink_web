import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import Script from "next/script";

import HomeLanding from "@/components/home/HomeLanding";

/* --------------------------------
   Page Metadata (title comes from the root layout's default)
-------------------------------- */

const description =
  "Discover beauty + wellness on Glamlink: treatments, trusted professionals, products and expert insights.";

export const metadata: Metadata = {
  description,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Glamlink | Beauty Lives Here",
    description,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/assets/oglayout.png`,
        width: 1200,
        height: 630,
        alt: "Glamlink Beauty & Wellness Platform",
      },
    ],
  },
};

/* --------------------------------
   Structured Data
-------------------------------- */

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Glamlink",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    // Same destination as the home page search box
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

/* --------------------------------
   Page
-------------------------------- */

export default function HomePage() {
  return (
    <>
      {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <HomeLanding />
    </>
  );
}
