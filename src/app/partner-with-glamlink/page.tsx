import { SITE_URL } from "@/lib/config";
import { Metadata } from "next";
import Script from "next/script";

import MediaKitHero from "@/components/mediaKit/MediaKitHero";
import PublicationSection from "@/components/mediaKit/PublicationSection";
import DistributionSection from "@/components/mediaKit/DistributionSection";
import AudienceSection from "@/components/mediaKit/AudienceSection";
import FeatureOpportunitiesSection from "@/components/mediaKit/FeatureOpportunitiesSection";
import CommunitySection from "@/components/mediaKit/CommunitySection";
import WhySection from "@/components/mediaKit/WhySection";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
import { pageRobots } from "@/lib/indexing";

/* ─────────────────────────────────────────────
   METADATA (SEO)
───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Partner With Glamlink | The Glamlink Edit",
  description:
    "Advertise, get featured, or partner with The Glamlink Edit — a modern beauty & wellness publication built for discovery, credibility, and real client connection.",
  keywords: [
    "beauty Partner With Glamlink",
    "wellness advertising",
    "glamlink magazine",
    "med spa marketing",
    "aesthetic clinic promotion",
    "beauty publication advertising",
  ],
  alternates: {
    canonical: `${SITE_URL}/media-kit`,
  },
  openGraph: {
    title: "Partner With Glamlink | The Glamlink Edit",
    description:
      "Feature your brand, clinic, or expertise in The Glamlink Edit — a modern beauty & wellness publication.",
    url: `${SITE_URL}/media-kit`,
    siteName: "Glamlink",
    images: [
      {
        url: `${SITE_URL}/default-blog.jpg`,
        width: 1200,
        height: 630,
        alt: "The Glamlink Edit Partner With Glamlink",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner With Glamlink | The Glamlink Edit",
    description:
      "Advertise and get featured in The Glamlink Edit — built for visibility and real business growth.",
    images: [`${SITE_URL}/default-blog.jpg`],
  },
  robots: pageRobots({
    index: true,
    follow: true,
  }),
};

/* ─────────────────────────────────────────────
   STRUCTURED DATA
───────────────────────────────────────────── */
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Partner With Glamlink | The Glamlink Edit",
  description:
    "Advertising and feature opportunities in The Glamlink Edit beauty & wellness publication.",
  url: `${SITE_URL}/media-kit`,
  publisher: {
    "@type": "Organization",
    name: "Glamlink",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.png`,
    },
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Magazine",
      item: `${SITE_URL}/magazine`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Partner With Glamlink",
      item: `${SITE_URL}/partner`,
    },
  ],
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function MediaKitPage() {
  return (
    <>
      {/* Structured Data */}
      <Script
        id="mediakit-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-card">
        <MediaKitHero />
        <PublicationSection />
        <DistributionSection />
        <AudienceSection />
        <FeatureOpportunitiesSection />
        <CommunitySection />
        <WhySection />
        <ConditionalGetFeatured />
      </main>
    </>
  );
}
