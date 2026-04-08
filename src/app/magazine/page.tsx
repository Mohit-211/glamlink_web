import type { Metadata } from "next";
import Script from "next/script";
import MagazineHero from "@/components/magazine/MagazineHero";
import MagazineIssues from "@/components/magazine/MagazineIssues";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";
/* --------------------------------
   Page Metadata
-------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://glamlink.com"),
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
    canonical: "/magazine",
  },
  openGraph: {
    type: "website",
    url: "/magazine",
    title: "Glamlink Beauty Magazine",
    description:
      "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",
    images: [
      {
        url: "/assets/magazine-og.png", // 👈 YOU MUST CREATE THIS
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
    images: ["/assets/magazine-og.png"],
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
  url: "https://glamlink.com/magazine",
  publisher: {
    "@type": "Organization",
    name: "Glamlink",
    url: "https://glamlink.com",
  },
};
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Glamlink Magazine Issues",
  description:
    "The Professionals, Treatments and Innovations Shaping Beauty + Wellness",
  url: "https://glamlink.com/magazine",
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
      <main className="pt-16 lg:pt-20">
        <MagazineHero />
        <MagazineIssues />
      </main>
      <ConditionalGetFeatured />
    </div>
  );
}