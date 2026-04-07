import type { Metadata } from "next";
import Script from "next/script";

import MagazineHero from "@/components/magazine/MagazineHero";
import MagazineIssues from "@/components/magazine/MagazineIssues";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  title: "Beauty Magazine & Industry Stories",

  description:
    "Explore Glamlink Magazine featuring beauty trends, professional stories, industry insights, and editorial features from the beauty and wellness world.",

  keywords: [
    "beauty magazine",
    "beauty industry magazine",
    "beauty editorial",
    "beauty trends magazine",
    "beauty professional stories",
    "glamlink magazine",
  ],

  alternates: {
    canonical: "/magazine",
  },

  openGraph: {
    title: "Glamlink Beauty Magazine",
    description:
      "Explore editorial stories, beauty trends, and professional insights from the Glamlink Magazine.",
    url: "https://glamlink.com/magazine",
  },
};

/* --------------------------------
   Structured Data
-------------------------------- */

const magazineSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWorkSeries",
  name: "Glamlink Magazine",
  description:
    "A digital beauty and wellness magazine featuring industry insights, professional stories, and beauty trends.",
  url: "https://glamlink.com/magazine",
  publisher: {
    "@type": "Organization",
    name: "Glamlink",
    url: "https://glamlink.com",
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Glamlink Magazine Issues",
  description:
    "Browse digital issues of Glamlink Magazine featuring beauty professionals, trends, and insights.",
  url: "https://glamlink.com/magazine",
};

/* --------------------------------
   Page
-------------------------------- */

export default function Magazine() {
  return (
    <div className="min-h-screen bg-background">
      {/* Magazine Schema */}
      <Script
        id="magazine-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(magazineSchema),
        }}
      />

      {/* Collection Schema */}
      <Script
        id="magazine-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <main className="pt-16 lg:pt-20">
        <MagazineHero />
        <MagazineIssues />
      </main>
      <ConditionalGetFeatured />
    </div>
  );
}
