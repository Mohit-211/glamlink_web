"use client";

import PricingStep from "@/components/Pricing/Pricing1";
import { useSearchParams } from "next/navigation";
import React from "react";

const PricingPage = () => {
  const searchParams = useSearchParams();
  const businessCardId = searchParams.get("businessCardId");

  return (
    <div>
      <PricingStep businessCardId={businessCardId} />
    </div>
  );
};

export default PricingPage;