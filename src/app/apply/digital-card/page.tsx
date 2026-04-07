"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

const GlamCardHero = dynamic(
  () => import("@/components/glamcard/GlamCardHero"),
  { ssr: false }
);

const GlamCardApplication = dynamic(
  () => import("@/components/glamcard/GlamCardForm/GlamCardApplication"),
  { ssr: false }
);

export default function DigitalApplyPage() {
  const applyRef = useRef<HTMLDivElement | null>(null);

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Glamlink Digital Access Card",
    description:
      "A digital business card for beauty and wellness professionals to showcase their services, profile, and connect with clients.",
    provider: {
      "@type": "Organization",
      name: "Glamlink",
      url: "https://glamlink.com",
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

      <main className="pt-16 lg:pt-20">
        <section className="pb-20">
          <GlamCardHero onApplyClick={scrollToApply} />
        </section>

        <section ref={applyRef} className="bg-muted/30 py-20 scroll-mt-24">
          <div className="px-4 sm:px-6 lg:px-8">
            <GlamCardApplication />
          </div>
        </section>
      </main>
    </div>
  );
}
