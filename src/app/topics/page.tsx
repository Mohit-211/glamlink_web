import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";
import Script from "next/script";

import TopicsPageClient from "@/components/topics/TopicsPageClient";

export const metadata: Metadata = {
  title: "Explore Beauty Topics",
  description:
    "Explore beauty concerns, treatments, skincare, hair, and wellness topics on Glamlink — expert insights, trusted articles, and the professionals behind them.",
  alternates: {
    canonical: `${SITE_URL}/topics`,
  },
  openGraph: {
    title: "Explore Beauty Topics | Glamlink",
    description:
      "Explore beauty concerns, treatments, skincare, hair, and wellness topics on Glamlink.",
    url: `${SITE_URL}/topics`,
    type: "website",
  },
};

export default function TopicsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-card">
      <Script
        id="topics-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Glamlink Beauty Topics",
            url: `${SITE_URL}/topics`,
          }),
        }}
      />

      <main className="flex-1">
        <TopicsPageClient />
      </main>
    </div>
  );
}
