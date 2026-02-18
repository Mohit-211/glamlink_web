"use client";

import type { ForClientsSection } from "../types";
import type { MagazineIssueCard } from "@/lib/pages/magazine/types";
import type { PromoItem } from "@/lib/features/promos/config";
import type { DigitalCardFormData } from "@/lib/pages/apply/get-digital-card/types";
import type { GetFeaturedFormData } from "@/lib/pages/apply/featured/types";
import type { FormConfigsData } from "@/lib/pages/apply/shared/services/formConfigService";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection,
  HTMLContentSection,
  WhyGlamlinkSection,
  BookTrustedProsSection,
  FounderBadgeSection,
  ProDiscoveryMapSection,
  DigitalCardsShowcaseSection,
  DigitalCardCTASection,
  MagazineHeroSection,
  MagazineListingSection,
  PromosHeroSection,
  PromosListingSection,
  PaginationCarouselSection,
  PassionIntoPowerSection,
  TwoBoxesSection,
  ExpertiseIntoSalesSection,
  EverythingYouNeedSection,
  FinalCTAForProsSection,
  DigitalCardHeroSection,
  DigitalCardFormSection,
  DigitalCardFinalCTASection,
  FeaturedHeroSection,
  FeaturedContentPreviewSection,
  FeaturedFormSection,
} from "./sections";

interface SectionRendererProps {
  section: ForClientsSection | any; // Accept all section types
  pageType?: string;
  onCtaClick?: () => void;
  // Magazine-specific props
  issues?: MagazineIssueCard[];
  issuesByYear?: Record<number, MagazineIssueCard[]>;
  // Promos-specific props
  promos?: PromoItem[];
  featuredPromos?: PromoItem[];
  selectedPromo?: PromoItem | null;
  isModalOpen?: boolean;
  onPromoClick?: (promo: PromoItem) => void;
  onModalClose?: () => void;
  onPromoCta?: (promo: PromoItem) => void;
  // Digital Card-specific props
  onDigitalCardSubmit?: (data: DigitalCardFormData) => Promise<void>;
  isDigitalCardLoading?: boolean;
  // Featured Application-specific props
  onFeaturedSubmit?: (data: GetFeaturedFormData) => Promise<void>;
  isFeaturedLoading?: boolean;
  featuredConfigs?: FormConfigsData;
  isFeaturedSuccess?: boolean;
  featuredError?: string | null;
}

/**
 * Generic Section Renderer
 *
 * Dynamically renders the appropriate section component based on the section type.
 * This is the main entry point for rendering CMS-managed content sections.
 *
 * Supports both for-clients and homepage sections through unified section registry.
 *
 * Usage:
 * ```tsx
 * {visibleSections.map(section => (
 *   <SectionRenderer
 *     key={section.id}
 *     section={section}
 *     onCtaClick={() => setShowDownloadDialog(true)}
 *   />
 * ))}
 * ```
 */
export function SectionRenderer({
  section,
  pageType,
  onCtaClick,
  issues,
  issuesByYear,
  promos,
  featuredPromos,
  selectedPromo,
  isModalOpen,
  onPromoClick,
  onModalClose,
  onPromoCta,
  onDigitalCardSubmit,
  isDigitalCardLoading,
  onFeaturedSubmit,
  isFeaturedLoading,
  featuredConfigs,
  isFeaturedSuccess,
  featuredError
}: SectionRendererProps) {
  switch (section.type) {
    // For-Clients Sections
    case 'hero':
      return <HeroSection section={section} onCtaClick={onCtaClick} />;
    case 'features':
      return <FeaturesSection section={section} />;
    case 'how-it-works':
      return <HowItWorksSection section={section} />;
    case 'testimonials':
      return <TestimonialsSection section={section} />;
    case 'cta':
      return <CTASection section={section} onCtaClick={onCtaClick} />;
    case 'html-content':
      return <HTMLContentSection section={section} />;

    // Home-Specific Sections
    case 'why-glamlink':
      return <WhyGlamlinkSection section={section} />;
    case 'book-trusted-pros':
      return <BookTrustedProsSection section={section} />;
    case 'founder-badge':
      return <FounderBadgeSection section={section} />;
    case 'pro-discovery-map':
      return <ProDiscoveryMapSection section={section} />;
    case 'digital-cards-showcase':
      return <DigitalCardsShowcaseSection section={section} />;
    case 'digital-card-cta':
      return <DigitalCardCTASection section={section} />;

    // Magazine Sections
    case 'magazine-hero':
      return <MagazineHeroSection section={section} />;
    case 'magazine-listing':
      return <MagazineListingSection section={section} issues={issues} issuesByYear={issuesByYear} />;

    // Promos Sections
    case 'promos-hero':
      return <PromosHeroSection section={section} />;
    case 'promos-listing':
      return (
        <PromosListingSection
          section={section}
          promos={promos}
          featuredPromos={featuredPromos}
          selectedPromo={selectedPromo}
          isModalOpen={isModalOpen}
          onPromoClick={onPromoClick}
          onModalClose={onModalClose}
          onCtaClick={onPromoCta}
        />
      );

    // For Professionals Sections
    case 'pagination-carousel':
      return <PaginationCarouselSection section={section} />;
    case 'passion-into-power':
      return <PassionIntoPowerSection section={section} />;
    case 'two-boxes':
      return <TwoBoxesSection section={section} />;
    case 'expertise-into-sales':
      return <ExpertiseIntoSalesSection section={section} />;
    case 'everything-you-need':
      return <EverythingYouNeedSection section={section} />;
    case 'final-cta-for-pros':
      return <FinalCTAForProsSection section={section} />;

    // Digital Card Application Sections
    case 'digital-card-hero':
      return <DigitalCardHeroSection section={section} />;
    case 'digital-card-form':
      return (
        <DigitalCardFormSection
          section={section}
          onSubmit={onDigitalCardSubmit}
          isLoading={isDigitalCardLoading}
        />
      );
    case 'digital-card-final-cta':
      return <DigitalCardFinalCTASection section={section} />;

    // Featured Application Sections
    case 'featured-hero':
      return <FeaturedHeroSection section={section} />;
    case 'featured-content-preview':
      return <FeaturedContentPreviewSection section={section} />;
    case 'featured-form':
      return (
        <FeaturedFormSection
          section={section}
          onSubmit={onFeaturedSubmit}
          isLoading={isFeaturedLoading}
          configs={featuredConfigs}
          isSuccess={isFeaturedSuccess}
          error={featuredError}
        />
      );

    default:
      console.warn(`Unknown section type: ${section.type}`);
      return null;
  }
}
