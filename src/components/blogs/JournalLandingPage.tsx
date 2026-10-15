import { Suspense } from "react";
import Script from "next/script";
import AdSenseScript from "@/ads/AdSenseScript";

import JournalClient from "@/components/blogs/JournalClient";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";

export default function JournalLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Script
        id="journal-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Glamlink Journal",
          }),
        }}
      />

      <AdSenseScript />

      <main className="flex-1">
        {/* 👇 Everything handled inside client now */}
        <Suspense fallback={null}>
          <JournalClient path="journal" />
        </Suspense>
        <ConditionalGetFeatured />
      </main>
    </div>
  );
}
