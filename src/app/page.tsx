import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import Script from "next/script";

import JournalLandingPage from "@/components/blogs/JournalLandingPage";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Beauty Industry Journal & Insights",

  description:
    "Explore beauty industry insights, trends, tips, and expert articles.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Beauty Industry Journal & Insights | Glamlink",
    description:
      "Explore beauty industry insights, trends, tips, and expert articles.",
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
    target: `${SITE_URL}/journal/directory?search={search_term_string}`,
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

      <JournalLandingPage />
    </>
  );
}
