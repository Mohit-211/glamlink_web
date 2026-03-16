import type { Metadata } from "next";
import Script from "next/script";

import ClientsHero from "@/components/clients/ClientsHero";
import PhoneMockups from "@/components/clients/PhoneMockups";
import FeaturesGrid from "@/components/clients/FeaturesGrid";
import HowItWorks from "@/components/clients/HowItWorks";
import ClientsCTA from "@/components/clients/ClientsCTA";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  title: "For Clients – Discover & Book Beauty Professionals",

  description:
    "Discover verified beauty and wellness professionals near you with Glamlink. Browse services, explore profiles, and book trusted beauty experts easily.",

  keywords: [
    "find beauty professionals",
    "book beauty services",
    "salon booking platform",
    "find makeup artist near me",
    "skincare professionals near me",
    "beauty services marketplace",
    "glamlink clients",
  ],

  alternates: {
    canonical: "/for-clients",
  },

  openGraph: {
    title: "Discover & Book Beauty Professionals | Glamlink",
    description:
      "Browse verified beauty experts, discover services, and book professionals easily with Glamlink.",
    url: "https://glamlink.com/for-clients",
  },
};

/* --------------------------------
   Structured Data
-------------------------------- */

const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Glamlink For Clients",
  url: "https://glamlink.com/for-clients",
  description:
    "A platform for clients to discover, explore, and book trusted beauty and wellness professionals.",
  isPartOf: {
    "@type": "WebSite",
    name: "Glamlink",
    url: "https://glamlink.com",
  },
};

/* --------------------------------
   Page
-------------------------------- */

export default function ForClients() {
  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <Script
        id="for-clients-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />

      <main>
        <ClientsHero />
        <PhoneMockups />
        <FeaturesGrid />
        <HowItWorks />
        <ClientsCTA />
      </main>
    </div>
  );
}
