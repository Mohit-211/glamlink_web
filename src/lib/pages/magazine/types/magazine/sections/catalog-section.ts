import { BaseSectionStyling } from "../fields/typography";
import { 
  ClinicalTrial, 
  UserGeneratedContent, 
  BeautyBoxSubscription, 
  YouthTrendItem, 
  SustainableProduct, 
  BeautyInvestment, 
  LiveCommerceEvent 
} from "./entities";

// Catalog section types that map to existing components
export type CatalogSectionType = "beauty-lab" | "ugc-spotlight" | "beauty-box" | "gen-z-trends" | "ai-advisor" | "sustainable" | "investment" | "live-commerce" | "science" | "multi-gen";

export interface CatalogSectionContent extends BaseSectionStyling {
  type: "catalog-section";
  catalogType: CatalogSectionType;
  data?: {
    // Data to pass to the catalog component
    // This overrides any Firestore data
    clinicalTrials?: ClinicalTrial[];
    userContent?: UserGeneratedContent[];
    beautyBoxes?: BeautyBoxSubscription[];
    trends?: YouthTrendItem[];
    products?: SustainableProduct[];
    investments?: BeautyInvestment[];
    events?: LiveCommerceEvent[];
    // Add other data types as needed

    // Pagination-specific properties for format-contained version
    showStats?: boolean;
    showLabelsGuide?: boolean;
    showCTA?: boolean;
    showHeader?: boolean;
    showTopics?: number[];
    showCompatibilityGuide?: boolean;
    showResources?: boolean;
  };
}
