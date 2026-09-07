import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";

import JournalClient from "@/components/blogs/JournalClient";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";

export const metadata: Metadata = {
  title: "Beauty Industry Journal & Insights",
  description:
    "Explore beauty industry insights, trends, tips, and expert articles.",
};

export default function JournalPage() {
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

      {/* Google AdSense */}
      <Script
        id="google-adsense"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2781788508074958"
      />

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
