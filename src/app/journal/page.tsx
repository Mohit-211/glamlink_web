import type { Metadata } from "next";
import Script from "next/script";

import BlogGrid from "@/components/blogs/BlogGrid";
import CategoryNav from "@/components/blogs/CategoryNav";
import HeroSection from "@/components/blogs/HeroSection";

/* --------------------------------
   Page Metadata
-------------------------------- */

export const metadata: Metadata = {
  title: "Beauty Industry Journal & Insights",

  description:
    "Explore beauty industry insights, trends, tips, and expert articles on Glamlink Journal. Discover skincare advice, makeup techniques, wellness knowledge, and professional beauty guidance.",

  keywords: [
    "beauty industry blog",
    "beauty trends",
    "skincare tips",
    "makeup techniques",
    "beauty professional advice",
    "salon industry insights",
    "glamlink journal",
  ],

  alternates: {
    canonical: "/journal",
  },

  openGraph: {
    title: "Beauty Industry Journal | Glamlink",
    description:
      "Discover expert insights, trends, and beauty knowledge from professionals in the beauty and wellness industry.",
    url: "https://glamlink.com/journal",
  },
};

/* --------------------------------
   Structured Data
-------------------------------- */

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Glamlink Journal",
  description:
    "A collection of articles, insights, and trends from the beauty and wellness industry.",
  url: "https://glamlink.com/journal",
  publisher: {
    "@type": "Organization",
    name: "Glamlink",
    url: "https://glamlink.com",
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Beauty Journal Articles",
  description:
    "Browse the latest beauty industry articles, expert advice, and insights from Glamlink.",
  url: "https://glamlink.com/journal",
};

/* --------------------------------
   Page
-------------------------------- */

export default function Journal() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Structured Data */}
      <Script
        id="journal-blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />

      <Script
        id="journal-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <main className="flex-1">
        <HeroSection />
        <CategoryNav />
        <BlogGrid />
      </main>
    </div>
  );
}
