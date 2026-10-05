import { Suspense } from "react";
import type { Metadata } from "next";
import GlamlinkDirectoryPage from "@/components/glamlinkDirectory/GlamlinkDirectoryPage";

export const metadata: Metadata = {
  title: "Beauty + Wellness Directory",
  description:
    "Find beauty and wellness professionals near you. Search trusted estheticians, med spas and hair stylists across the U.S. on Glamlink.",
  alternates: {
    canonical: "https://glamlink.net/directory",
  },
  openGraph: {
    title: "Glamlink Directory | Find Beauty + Wellness Professionals Near You",
    description: "Search trusted beauty and wellness professionals and businesses across the U.S.",
    url: "https://glamlink.net/directory",
  },
};

export default function DirectoryPage() {
  return (
    <Suspense fallback={null}>
      <GlamlinkDirectoryPage />
    </Suspense>
  );
}
