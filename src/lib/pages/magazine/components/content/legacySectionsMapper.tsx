import React from "react";
import { CatalogSectionType } from "../../types/magazine";
import { BeautyLab, UGCSpotlight, BeautyBox, GenZTrends, AIBeautyAdvisor, SustainableBeauty, BeautyInvestment, LiveCommerce, BeautyScience, MultiGenerational } from "./sections-legacy";

// Map catalog section types to their components
export const getCatalogSectionComponent = (catalogType: CatalogSectionType, data?: any): React.ReactElement | null => {
  switch (catalogType) {
    case "beauty-lab":
      return <BeautyLab trials={data?.clinicalTrials || []} />;

    case "ugc-spotlight":
      return <UGCSpotlight content={data?.userContent || []} />;

    case "beauty-box":
      return <BeautyBox subscriptions={data?.beautyBoxes || []} />;

    case "gen-z-trends":
      return <GenZTrends trends={data?.trends} />;

    case "ai-advisor":
      return <AIBeautyAdvisor />;

    case "sustainable":
      return <SustainableBeauty products={data?.products} />;

    case "investment":
      return <BeautyInvestment investments={data?.investments} />;

    case "live-commerce":
      return <LiveCommerce events={data?.events} />;

    case "science":
      return <BeautyScience />;

    case "multi-gen":
      return <MultiGenerational products={data?.products} />;

    default:
      return null;
  }
};

// Get display name for catalog section type
export const getCatalogSectionDisplayName = (catalogType: CatalogSectionType): string => {
  const displayNames: Record<CatalogSectionType, string> = {
    "beauty-lab": "Beauty Lab: Clinical Trials",
    "ugc-spotlight": "User Generated Content",
    "beauty-box": "Beauty Box Subscriptions",
    "gen-z-trends": "Gen Z & Gen Alpha Trends",
    "ai-advisor": "AI Beauty Advisor",
    sustainable: "Sustainable Beauty",
    investment: "Beauty Investment Calculator",
    "live-commerce": "Live Commerce Hub",
    science: "Beauty Science Simplified",
    "multi-gen": "Multi-Generational Beauty",
  };

  return displayNames[catalogType] || catalogType;
};
