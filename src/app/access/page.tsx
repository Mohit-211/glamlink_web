"use client";
import { SITE_URL } from "@/lib/config";

import React from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import AccessPricingSection from "@/components/AccessPricingSection/AccessPricingSection";
import GlamCardHero from "@/components/glamcard/GlamCardHero";

const GlamCardApplication = dynamic(
  () => import("@/components/glamcard/GlamCardForm/GlamCardApplication"),
  { ssr: false }
);

/** The profile form: the hero's button scrolls to it, and /access#create-profile opens on it. */
const FORM_ID = "create-profile";

export default function DigitalApplyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Glamlink Digital Access Card",
    description:
      "A digital business card for beauty and wellness professionals to showcase their services, profile, and connect with clients.",
    provider: {
      "@type": "Organization",
      name: "Glamlink",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="digital-card-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main>
        <GlamCardHero formId={FORM_ID} />
        {/* <section className="pb-20">
          <AccessPricingSection />
        </section> */}
        <section
          id={FORM_ID}
          tabIndex={-1}
          aria-label="Create your profile"
          className="scroll-mt-16 bg-muted/30 py-10 outline-none md:scroll-mt-20 md:py-14"
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <GlamCardApplication />
          </div>
        </section>
      </main>
    </div>
  );
}
