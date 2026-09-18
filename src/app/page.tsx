import type { Metadata } from "next";
import Script from "next/script";

import JournalLandingPage from "@/components/blogs/JournalLandingPage";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://glamlink.net"),

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
    url: "https://glamlink.net",
    images: [
      {
        url: "https://glamlink.net/assets/oglayout.png",
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
  url: "https://glamlink.net",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://glamlink.net/journal/directory?search={search_term_string}",
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
