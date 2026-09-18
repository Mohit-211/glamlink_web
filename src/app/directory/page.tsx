import { Metadata } from "next";
import { Suspense } from "react";
import DirectoryPageClient from "@/components/directory/DirectoryPageClient";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Directory | Glamlink",
  description:
    "Discover professionals, brands, software companies, manufacturers, and other businesses in the beauty industry.",
  alternates: {
    canonical: "https://glamlink.net/directory",
  },
  openGraph: {
    title: "Directory | Glamlink",
    description:
      "Discover professionals, brands, software companies, manufacturers, and other businesses in the beauty industry.",
    url: "https://glamlink.net/directory",
    type: "website",
  },
};

export default function DirectoryPage() {
  redirect("/");
  return (
    <Suspense fallback={null}>
      <DirectoryPageClient />
    </Suspense>
  );
}
