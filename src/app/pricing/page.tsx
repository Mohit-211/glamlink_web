import { Suspense } from "react";
import type { Metadata } from "next";
import PricingEntry from "@/components/Pricing/PricingEntry";

// A step of one card's purchase, not a page to find in search.
export const metadata: Metadata = {
  title: "Choose your plan",
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="page-soft flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <PricingEntry />
    </Suspense>
  );
}
