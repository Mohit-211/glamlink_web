// Import all section content types
import { FeaturedStoryContent } from "./sections/featured-story";
import { ProductShowcaseContent } from "./sections/product-showcase";
import { ProviderSpotlightContent } from "./sections/provider-spotlight";
import { TrendReportContent } from "./sections/trend-report";
import { BeautyTipsContent } from "./sections/beauty-tips";
import { TransformationContent } from "./sections/transformation";
import { CatalogSectionContent } from "./sections/catalog-section";
import { FounderStoryContent } from "./sections/founder-story";
import { TableOfContentsContent } from "./sections/table-of-contents";
import { CoverProFeatureContent } from "./sections/cover-pro-feature";
import { WhatsNewGlamlinkContent } from "./sections/whats-new-glamlink";
import { TopTreatmentContent } from "./sections/top-treatment";
import { TopProductSpotlightContent } from "./sections/top-product-spotlight";
import { MariesColumnContent } from "./sections/maries-column";
import { MariesCornerContent } from "./sections/maries-corner";
import { CoinDropContent } from "./sections/coin-drop";
import { GlamlinkStoriesContent } from "./sections/glamlink-stories";
import { SpotlightCityContent } from "./sections/spotlight-city";
import { ProTipsContent } from "./sections/pro-tips";
import { EventRoundUpContent } from "./sections/event-roundup";
import { WhatsHotWhatsOutContent } from "./sections/whats-hot-whats-out";
import { QuoteWallContent } from "./sections/quote-wall";
import { RisingStarContent } from "./sections/rising-star";
import { MagazineClosingContent } from "./sections/magazine-closing";
import { CustomSectionContent } from "./sections/custom-section";

// Union type for all magazine section content
export type MagazineIssueSectionContent =
  | FeaturedStoryContent
  | ProductShowcaseContent
  | ProviderSpotlightContent
  | TrendReportContent
  | BeautyTipsContent
  | TransformationContent
  | CatalogSectionContent
  | FounderStoryContent
  | TableOfContentsContent
  | CoverProFeatureContent
  | WhatsNewGlamlinkContent
  | TopTreatmentContent
  | TopProductSpotlightContent
  | MariesColumnContent
  | MariesCornerContent
  | CoinDropContent
  | GlamlinkStoriesContent
  | SpotlightCityContent
  | ProTipsContent
  | EventRoundUpContent
  | WhatsHotWhatsOutContent
  | QuoteWallContent
  | RisingStarContent
  | MagazineClosingContent
  | CustomSectionContent;

// Re-export all section types for convenience
export type {
  FeaturedStoryContent,
  ProductShowcaseContent,
  ProviderSpotlightContent,
  TrendReportContent,
  BeautyTipsContent,
  TransformationContent,
  CatalogSectionContent,
  FounderStoryContent,
  TableOfContentsContent,
  CoverProFeatureContent,
  WhatsNewGlamlinkContent,
  TopTreatmentContent,
  TopProductSpotlightContent,
  MariesColumnContent,
  MariesCornerContent,
  CoinDropContent,
  GlamlinkStoriesContent,
  SpotlightCityContent,
  ProTipsContent,
  EventRoundUpContent,
  WhatsHotWhatsOutContent,
  QuoteWallContent,
  RisingStarContent,
  MagazineClosingContent,
  CustomSectionContent
};

// Also re-export CatalogSectionType from catalog-section
export type { CatalogSectionType } from "./sections/catalog-section";

// Re-export ContentBlock for custom sections
export type { ContentBlock } from "./sections/custom-section";