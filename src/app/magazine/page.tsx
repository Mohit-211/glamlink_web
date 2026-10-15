import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import Script from "next/script";
import MagazineHero from "@/components/magazine/MagazineHero";
import MagazineIssues from "@/components/magazine/MagazineIssues";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
/* --------------------------------
   Page Metadata
-------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Beauty Magazine & Industry Stories | Glamlink",

  description:
    "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",

  keywords: [
    "beauty magazine",
    "beauty industry insights",
    "beauty trends 2026",
    "beauty editorial",
    "glamlink magazine",
    "salon professionals stories",
    "wellness industry content",
  ],

  alternates: {
    canonical: `${SITE_URL}/magazine`,
  },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/magazine`, // ✅ FIXED

    title: "Glamlink Beauty Magazine",

    description:
      "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",

    images: [
      {
        url: `${SITE_URL}/assets/magazine-og.png`, // ✅ FIXED
        width: 1200,
        height: 630,
        alt: "Glamlink Magazine - Beauty Trends and Industry Insights",
      },
    ],

    siteName: "Glamlink",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Glamlink Beauty Magazine",
    description:
      "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",

    images: [`${SITE_URL}/assets/magazine-og.png`], // ✅ FIXED
  },
  robots: {
    index: true,
    follow: true,
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
    "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",
  url: `${SITE_URL}/magazine`,
  publisher: {
    "@type": "Organization",
    name: "Glamlink",
    url: SITE_URL,
  },
};
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Glamlink Magazine Issues",
  description:
    "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",
  url: `${SITE_URL}/magazine`,
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
      <main>
        <MagazineHero />
        <MagazineIssues />
      </main>
      <ConditionalGetFeatured />
    </div>
  );
}