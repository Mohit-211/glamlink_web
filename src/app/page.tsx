import type { Metadata } from "next";
import Script from "next/script";

import Hero from "@/components/home/Hero";
import AccessSection from "@/components/home/AccessSection";
import WhyGlamlinkSection from "@/components/home/WhyGlamlinkSection";
import FounderBadge from "@/components/home/FounderBadge";
import ProfessionalsMarketplace from "@/components/professionals/ProfessionalsMarketplace";
import DirectoryApplySection from "@/components/home/DirectoryApplySection";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  title: "Discover Beauty Professionals Near You",

  description:
    "Find trusted beauty and wellness professionals near you with Glamlink. Discover salons, skincare specialists, makeup artists, and book services easily.",

  keywords: [
    "beauty professionals near me",
    "find makeup artist",
    "beauty services near me",
    "salons near me",
    "skincare specialists",
    "glamlink directory",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Discover Beauty Professionals Near You | Glamlink",
    description:
      "Explore verified beauty professionals, book services, and discover beauty insights on Glamlink.",
    url: "https://glamlink.com",
  },
};

/* --------------------------------
   Structured Data
-------------------------------- */

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Glamlink",
  url: "https://glamlink.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://glamlink.com/directory?search={search_term_string}",
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

      <Hero />
      <AccessSection />
      <DirectoryApplySection/>
      <ProfessionalsMarketplace />
      <WhyGlamlinkSection />
      <FounderBadge />
    </>
  );
}
