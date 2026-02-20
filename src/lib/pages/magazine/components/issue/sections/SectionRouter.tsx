"use client";

import Image from "next/image";
import type { MagazinePageSection, MagazineIssue, MagazinePage } from "../../../types";
import FounderStory from "../../magazine/FounderStory";
import { getCatalogSectionComponent } from "../../content/legacySectionsMapper";
import TableOfContentsSection from "../../magazine/TableOfContentsSection";
import { normalizeImageFields } from "./useSectionRouter";
import {
  RisingStar,
  CoverProFeature,
  WhatsNewGlamlink,
  TopTreatment,
  TopProductSpotlight,
  MariesColumn,
  MariesCorner,
  CoinDrop,
  GlamlinkStories,
  SpotlightCity,
  ProTips,
  EventRoundUp,
  WhatsHotWhatsOut,
  QuoteWall,
  MagazineClosing,
  CustomSection,
} from "../../content/sections-legacy";

export interface SectionRouterProps {
  pageSection: MagazinePageSection;
  issue?: MagazineIssue;
  pages?: MagazinePage[];
  onNavigate?: (pageNumber: number) => void;
}

/**
 * Routes a section to its appropriate component based on section type.
 */
export function SectionRouter({
  pageSection,
  issue,
  pages,
  onNavigate,
}: SectionRouterProps) {
  const { section, startIndex } = pageSection;

  // Normalize the content to extract URLs from image objects
  const normalizedContent = normalizeImageFields(section.content);

  // Use section.type if content.type is not available
  const sectionType = section.content?.type || section.type;

  switch (sectionType) {
    // New Glamlink Edit sections
    case "rising-star":
      return (
        <RisingStar
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
          issueId={issue?.id}
        />
      );

    case "cover-pro-feature":
      return (
        <CoverProFeature
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
          issueId={issue?.id}
        />
      );

    case "whats-new-glamlink":
      return (
        <WhatsNewGlamlink
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "top-treatment":
      return (
        <TopTreatment
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
          issueId={issue?.id}
        />
      );

    case "top-product-spotlight":
      return (
        <TopProductSpotlight
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
          issueId={issue?.id}
        />
      );

    case "maries-column":
      return (
        <MariesColumn
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "maries-corner":
      return (
        <MariesCorner
          title={section.title}
          subtitle={section.subtitle}
          content={normalizedContent}
          backgroundColor={section.backgroundColor}
        />
      );

    case "coin-drop":
      return (
        <CoinDrop
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "glamlink-stories":
      return (
        <GlamlinkStories
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    // Rotating sections
    case "spotlight-city":
      return (
        <SpotlightCity
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "pro-tips":
      return (
        <ProTips
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "event-roundup":
      return (
        <EventRoundUp
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "whats-hot-whats-out":
      return (
        <WhatsHotWhatsOut
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "quote-wall":
      return (
        <QuoteWall
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
        />
      );

    case "magazine-closing":
      return (
        <MagazineClosing
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={section.backgroundColor}
          issueId={issue?.id}
        />
      );

    case "custom-section":
      return (
        <CustomSection
          content={normalizedContent}
          title={section.title}
          subtitle={section.subtitle}
          backgroundColor={
            typeof section.backgroundColor === "string"
              ? section.backgroundColor
              : section.backgroundColor?.main
          }
          issueId={issue?.id}
        />
      );

    // Existing sections
    case "founder-story":
      return <FounderStory section={section} />;

    case "catalog-section":
      return getCatalogSectionComponent(
        normalizedContent.catalogType,
        normalizedContent.data
      );

    case "featured-story":
      return (
        <FeaturedStorySection
          section={section}
          content={normalizedContent}
          startIndex={startIndex}
        />
      );

    case "product-showcase":
      return (
        <ProductShowcaseSection
          section={section}
          content={normalizedContent}
          startIndex={startIndex}
        />
      );

    case "beauty-tips":
      return (
        <BeautyTipsSection
          section={section}
          content={section.content}
          startIndex={startIndex}
        />
      );

    case "table-of-contents":
      if (issue && pages && onNavigate) {
        return (
          <TableOfContentsSection
            issue={issue}
            pages={pages}
            onNavigate={onNavigate}
            backgroundColor={(issue as any)?.tocBackgroundColor}
          />
        );
      }
      return null;

    case "trend-report":
      return (
        <TrendReportSection
          section={section}
          content={section.content}
          startIndex={startIndex}
        />
      );

    default:
      return (
        <div className="h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {section.title}
          </h3>
          {section.subtitle && (
            <p className="text-gray-600">{section.subtitle}</p>
          )}
        </div>
      );
  }
}

// Sub-components for inline sections

interface FeaturedStorySectionProps {
  section: any;
  content: any;
  startIndex?: number;
}

function FeaturedStorySection({
  section,
  content,
  startIndex,
}: FeaturedStorySectionProps) {
  const isEditorsNote =
    section.title === "Editor's Note" || section.id === "editor-note";

  return (
    <article
      className={`h-full flex flex-col ${
        isEditorsNote ? "p-4 lg:p-6 text-gray-900" : ""
      }`}
    >
      {/* Title */}
      <div className={`mb-4 ${isEditorsNote ? "text-gray-900" : ""}`}>
        <h2
          className={`text-2xl font-bold ${
            isEditorsNote ? "text-gray-900" : "text-gray-900"
          }`}
        >
          {section.title}
        </h2>
        {section.subtitle && (
          <p
            className={`mt-1 ${isEditorsNote ? "text-gray-900" : "text-gray-600"}`}
          >
            {section.subtitle}
          </p>
        )}
      </div>

      {/* Hero Image */}
      {content.heroImage && (
        <div className="relative h-64 mb-4">
          <Image
            src={content.heroImage}
            alt={content.heroImageAlt}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Author and read time */}
      {(content.author || content.readTime) && (
        <div
          className={`flex items-center gap-4 text-sm mb-4 ${
            isEditorsNote ? "text-gray-900" : "text-gray-600"
          }`}
        >
          {content.author && <span>By {content.author}</span>}
          {content.readTime && <span>• {content.readTime}</span>}
        </div>
      )}

      {/* Body text */}
      <div
        className={`prose prose-sm max-w-none flex-1 ${
          isEditorsNote ? "prose-gray dark:prose-invert text-gray-900" : ""
        }`}
      >
        {startIndex && startIndex > 0 && (
          <p
            className={`text-sm italic mb-2 ${
              isEditorsNote ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Continued from previous page
          </p>
        )}
        <div
          className={`${isEditorsNote ? "text-gray-900 magazine-main-content" : ""}`}
          dangerouslySetInnerHTML={{ __html: content.body }}
        />
      </div>
    </article>
  );
}

interface ProductShowcaseSectionProps {
  section: any;
  content: any;
  startIndex?: number;
}

function ProductShowcaseSection({
  section,
  content,
  startIndex,
}: ProductShowcaseSectionProps) {
  return (
    <div className="h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
      {startIndex && startIndex > 0 && (
        <p className="text-sm text-gray-500 italic mb-2">
          Continued from previous page
        </p>
      )}
      {content.theme && (
        <p className="text-glamlink-teal font-medium mb-4">{content.theme}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {content.products.map((product: any) => (
          <div key={product.id} className="bg-gray-50 rounded-lg p-3">
            <div className="relative aspect-square mb-2">
              <Image
                src={product.image || "/images/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <h4 className="font-semibold text-sm">{product.name}</h4>
            <p className="text-xs text-gray-600">{product.brandName}</p>
            <p className="text-sm font-bold mt-1">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BeautyTipsSectionProps {
  section: any;
  content: any;
  startIndex?: number;
}

function BeautyTipsSection({
  section,
  content,
  startIndex,
}: BeautyTipsSectionProps) {
  return (
    <div className="h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
      {startIndex && startIndex > 0 && (
        <p className="text-sm text-gray-500 italic mb-2">
          Continued from previous page
        </p>
      )}
      <div className="space-y-3">
        {content.tips.map((tip: any, index: number) => (
          <div key={`tip-${index}`} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-gray-900">{tip.title}</h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  tip.difficulty === "beginner"
                    ? "bg-green-100 text-green-700"
                    : tip.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {tip.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TrendReportSectionProps {
  section: any;
  content: any;
  startIndex?: number;
}

function TrendReportSection({
  section,
  content,
  startIndex,
}: TrendReportSectionProps) {
  return (
    <div className="h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
      {startIndex && startIndex > 0 && (
        <p className="text-sm text-gray-500 italic mb-2">
          Continued from previous page
        </p>
      )}
      <div className="space-y-4">
        {content.trends.map((trend: any, index: number) => (
          <div
            key={`trend-${index}`}
            className="bg-gray-50 rounded-lg overflow-hidden"
          >
            {trend.image && (
              <div className="relative h-32">
                <Image
                  src={trend.image}
                  alt={trend.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{trend.name}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    trend.popularity === "viral"
                      ? "bg-red-100 text-red-700"
                      : trend.popularity === "trending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {trend.popularity}
                </span>
              </div>
              <p className="text-sm text-gray-600">{trend.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectionRouter;
