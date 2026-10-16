"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PricingStep from "@/components/Pricing/Pricing1";

function PricingContent() {
  const searchParams = useSearchParams();
  const businessCardId = searchParams.get("businessCardId");
  const claim = searchParams.get("claim") === "1";
  const plan = searchParams.get("plan");

  return <PricingStep businessCardId={businessCardId} claim={claim} initialPlan={plan} />;
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}