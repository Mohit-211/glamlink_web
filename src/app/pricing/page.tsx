"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PricingStep from "@/components/Pricing/Pricing1";

function PricingContent() {
  const searchParams = useSearchParams();
  const businessCardId = searchParams.get("businessCardId");
  const claim = searchParams.get("claim") === "1";
  const plan = searchParams.get("plan");
  // Set when Stripe sends the person back from a bank or wallet page.
  const checkout = searchParams.get("checkout");
  const redirectStatus = searchParams.get("redirect_status");

  return (
    <PricingStep
      businessCardId={businessCardId}
      claim={claim}
      initialPlan={plan}
      returnCheckout={checkout}
      redirectStatus={redirectStatus}
    />
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}