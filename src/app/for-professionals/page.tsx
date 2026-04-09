import type { Metadata } from "next";
import Script from "next/script";

import ProfessionalsMarketplace from "@/components/professionals/ProfessionalsMarketplace";
import ProfileCards from "@/components/professionals/ProfileCards";
import SalesSection from "@/components/professionals/SalesSection";
import PromoBanner from "@/components/professionals/PromoBanner";
import CapabilitiesGrid from "@/components/professionals/CapabilitiesGrid";
import ProfessionalsCTA from "@/components/professionals/ProfessionalsCTA";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  title: "For Beauty Professionals – Grow Your Beauty Business",

  description:
    "Join Glamlink to grow your beauty business, connect with new clients, showcase your work, and build your professional brand with digital access cards and powerful tools.",

  keywords: [
    "beauty professional platform",
    "beauty professionals",
    "grow beauty business",
    "beauty marketplace for professionals",
    "digital business card for beauty professionals",
    "salon marketing platform",
    "beauty booking platform",
    "glamlink professionals",
  ],

  alternates: {
    canonical: "/for-professionals",
  },

  openGraph: {
    title: "Grow Your Beauty Business | Glamlink",
    description:
      "Join Glamlink and showcase your beauty expertise. Connect with new clients, grow your brand, and manage bookings with powerful tools.",
    url: "https://glamlink.net/for-professionals",
  },
};

/* --------------------------------
   Structured Data
-------------------------------- */

const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Glamlink For Beauty Professionals",
  url: "https://glamlink.net/for-professionals",
  description:
    "A platform for beauty and wellness professionals to grow their brand, attract clients, and manage services through Glamlink.",
  isPartOf: {
    "@type": "WebSite",
    name: "Glamlink",
    url: "https://glamlink.net",
  },
};

/* --------------------------------
   Page
-------------------------------- */

export default function ForProfessionals() {
  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <Script
        id="for-professionals-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />

      <main className="pt-16 lg:pt-20">
        <ProfessionalsMarketplace />
        <ProfileCards />
        <SalesSection />
        <PromoBanner />
        <CapabilitiesGrid />
        <ProfessionalsCTA />
        <ConditionalGetFeatured />
      </main>
    </div>
  );
}
