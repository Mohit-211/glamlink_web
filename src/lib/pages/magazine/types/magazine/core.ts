import { SectionPageConfig } from "../../config/sectionPageConfig";
import { SectionBackgroundConfig } from "./fields";
import { MagazineIssueSectionContent } from "./sections";

// Base types for magazine content
export interface MagazineProvider {
  id: string;
  name: string;
  specialty: string;
  certificationLevel: string;
  image: string;
  bio?: string;
  brandName: string;
  brandId: string;
}

export interface MagazineProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients?: string[];
  benefits?: string[];
  brandName: string;
  brandId: string;
}

// Magazine content structure
export interface MagazineContent {
  trendingProviders: MagazineProvider[];
  newProducts: MagazineProduct[];
  productHighlights: MagazineProduct[];
}

// Section configuration
export interface MagazineSection {
  title: string;
  subtitle: string;
  viewAllLink?: string;
  viewAllText?: string;
}

// Magazine page props
export interface MagazinePageProps {
  initialContent?: MagazineContent;
}

// Section component props
export interface TrendingProfilesProps {
  providers: MagazineProvider[];
  isLoading?: boolean;
}

export interface NewProductsProps {
  products: MagazineProduct[];
  isLoading?: boolean;
}

export interface ProductHighlightsProps {
  products: MagazineProduct[];
  isLoading?: boolean;
}

// Card component props
export interface MagazineProviderCardProps {
  provider: MagazineProvider;
}

export interface MagazineProductCardProps {
  product: MagazineProduct;
  isHighlight?: boolean;
}

// Section identifiers
export type MagazineSectionId = "trending-profiles" | "new-products" | "product-highlights" | "beauty-lab" | "ugc-spotlight" | "beauty-box" | "gen-z-trends" | "ai-advisor" | "sustainable" | "investment" | "live-commerce" | "science" | "multi-gen";

// Section metadata
export interface SectionConfig {
  id: MagazineSectionId;
  title: string;
  description: string;
  icon: string;
  businessValue: string;
}

// Filter state
export interface FilterState {
  selectedSections: MagazineSectionId[];
  maxSections: number;
}

// Extended magazine content to include all sections
export interface ExtendedMagazineContent extends MagazineContent {
  clinicalTrials?: import("./sections/entities").ClinicalTrial[];
  userContent?: import("./sections/entities").UserGeneratedContent[];
  beautyBoxes?: import("./sections/entities").BeautyBoxSubscription[];
  youthTrends?: import("./sections/entities").YouthTrendItem[];
  sustainableProducts?: import("./sections/entities").SustainableProduct[];
  investments?: import("./sections/entities").BeautyInvestment[];
  liveEvents?: import("./sections/entities").LiveCommerceEvent[];
  // AI advisor data would be interactive, not static
  // Science content would be educational articles
  // Multi-gen would use existing product data with age filters
}

// Magazine Issue Types
export interface MagazineIssue {
  id: string;
  urlId?: string; // URL-friendly identifier (e.g., "issue-1")
  title: string;
  titleTypography?: import("./fields/typography").BaseSectionStyling; // Typography settings for title
  subtitle: string;
  subtitleTypography?: import("./fields/typography").BaseSectionStyling; // Typography settings for subtitle
  featuredPerson?: string;
  featuredTitle?: string;
  issueNumber: number;
  issueDate: string; // YYYY-MM-DD format
  coverImage: string;
  coverImageAlt: string;
  coverBackgroundImage?: string; // Full cover image with text already included
  useCoverBackground?: boolean; // Flag to use background image instead of text overlays
  coverDisplayMode?: "html" | "background"; // Which cover to display on public page
  description: string;
  descriptionImage?: string; // Image to show in magazine listing and metadata (prioritized over cover images)
  editorNote?: string;
  editorNoteTocTitle?: string; // Custom title for Editor's Note in Table of Contents
  editorNoteTocSubtitle?: string; // Custom subtitle for Editor's Note in Table of Contents
  coverQuote?: string; // HTML supported quote text for cover
  coverQuotePosition?: "in-image" | "above-description"; // Where to display the quote
  coverBackgroundColor?: string; // Background color for the cover page
  tocBackgroundColor?: string; // Background color for Table of Contents page
  editorNoteBackgroundColor?: string; // Background color for Editor's Note page
  featured: boolean;
  visible?: boolean; // Controls whether issue is shown on public pages (defaults to true)
  visibleForPreview?: boolean; // Controls whether issue is shown in preview mode
  isEmpty?: boolean; // Flag to indicate if the issue has no content
  pdfUrl?: string; // URL to uploaded PDF file in Firebase Storage
  publuuLink?: string; // Publuu digital magazine embed URL
  pageConfigurations?: Record<string, SectionPageConfig>; // PDF page configuration for each section
  thumbnailConfig?: ThumbnailConfig; // Thumbnail navigation configuration
  pageThumbnails?: Record<number, string>; // Custom thumbnails per page ID
  sections: MagazineIssueSection[]; // Default to empty array if not provided
}

/**
 * Thumbnail configuration for magazine navigation
 */
export interface ThumbnailConfig {
  // Layout orientation for thumbnails
  thumbnailLayout?: 'portrait' | 'landscape';
  // Standard page thumbnails (Cover, TOC, Editor's Note)
  coverThumbnail?: string;
  tocThumbnail?: string;
  editorNoteThumbnail?: string;
  // Section thumbnails - keyed by section ID
  sectionThumbnails?: Record<string, string>;
  // Hidden thumbnails - which pages to hide in navigation
  hiddenPages?: {
    cover?: boolean;
    toc?: boolean;
    editorNote?: boolean;
    sections?: string[]; // Array of section IDs to hide
  };
}

export interface MagazineIssueSection {
  id: string;
  urlSlug?: string; // URL-friendly slug for this section (e.g., "from-the-treatment-room")
  type:
    | "featured-story"
    | "product-showcase"
    | "provider-spotlight"
    | "trend-report"
    | "beauty-tips"
    | "transformation"
    | "catalog-section"
    | "founder-story"
    | "table-of-contents"
    | "cover-pro-feature"
    | "whats-new-glamlink"
    | "top-treatment"
    | "top-product-spotlight"
    | "maries-column"
    | "maries-corner"
    | "coin-drop"
    | "glamlink-stories"
    | "spotlight-city"
    | "pro-tips"
    | "event-roundup"
    | "whats-hot-whats-out"
    | "quote-wall"
    | "rising-star"
    | "magazine-closing"
    | "custom-section";
  title: string;
  subtitle?: string;
  tocTitle?: string; // Custom title to display in Table of Contents (optional, falls back to title)
  tocSubtitle?: string; // Custom subtitle to display in Table of Contents (optional, falls back to subtitle)
  content: MagazineIssueSectionContent;
  backgroundColor?: string | SectionBackgroundConfig; // Background color(s) for the section
}

// Magazine Issue List Types
export interface MagazineIssueCard {
  id: string;
  urlId?: string; // URL-friendly identifier
  title: string;
  subtitle: string;
  featuredPerson?: string;
  featuredTitle?: string;
  issueNumber: number;
  issueDate: string;
  coverImage: string;
  coverImageAlt: string;
  publuuLink?: string; // Publuu digital magazine embed URL
  coverBackgroundImage?: string;
  useCoverBackground?: boolean;
  coverDisplayMode?: "html" | "background";
  description: string;
  descriptionImage?: string; // Image to show in magazine listing and metadata
  coverQuote?: string; // HTML supported quote text for cover
  coverQuotePosition?: "in-image" | "above-description"; // Where to display the quote
  featured: boolean;
  visible?: boolean; // Controls whether issue is shown on public pages (defaults to true)
  textPlacement?: import("./fields").TextPlacement;
  featuredPersonIssueHeight?: string | import("./fields").ResponsiveHeight;
}

// Magazine Page Types for Pagination
export interface MagazinePage {
  pageNumber: number;
  isLeftPage: boolean;
  sections: MagazinePageSection[];
}

export interface MagazinePageSection {
  section: MagazineIssueSection;
  startIndex?: number; // For partial content rendering
  endIndex?: number; // For partial content rendering
}

export interface MagazineSpread {
  leftPage: MagazinePage | null;
  rightPage: MagazinePage | null;
}

// Table of Contents Types
export interface TOCItem {
  id: string;
  title: string;
  subtitle?: string;
  type: MagazineIssueSection["type"];
  pageNumber: number;
  icon: string;
}

export interface TableOfContentsProps {
  issue: MagazineIssue;
  pages: MagazinePage[];
  currentPage: number;
  onNavigate: (pageNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
}
