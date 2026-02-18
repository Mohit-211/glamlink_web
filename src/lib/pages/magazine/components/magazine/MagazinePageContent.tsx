"use client";

import { MagazinePage, MagazinePageSection, MagazineIssue } from "../../types";
import Image from "next/image";
import FounderStory from "./FounderStory";
import { getCatalogSectionComponent } from "../content/legacySectionsMapper";
import TableOfContentsSection from "./TableOfContentsSection";
import { RisingStar, CoverProFeature, WhatsNewGlamlink, TopTreatment, TopProductSpotlight, MariesColumn, MariesCorner, CoinDrop, GlamlinkStories, SpotlightCity, ProTips, EventRoundUp, WhatsHotWhatsOut, QuoteWall, MagazineClosing, CustomSection } from "../content/sections-legacy";

// Helper function to normalize image fields from objects to strings (but preserves the object if objectFit is present)
const normalizeImageFields = (content: any): any => {
  if (!content) return content;

  // Handle primitive values
  if (typeof content !== "object") return content;

  // Handle arrays
  if (Array.isArray(content)) {
    return content.map((item) => normalizeImageFields(item));
  }

  // Handle objects
  const normalized = { ...content };
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];

    // If it's an image object with url property (but not a link-action field)
    if (value && typeof value === "object" && "url" in value && !Array.isArray(value) && typeof value.url === "string") {
      // Check if this is a link-action field (has 'action' property)
      if ("action" in value) {
        // This is a link-action field, preserve the full object
        normalized[key] = value;
      } else if ("objectFit" in value || "originalUrl" in value || "cropData" in value) {
        // Keep the full object to preserve objectFit and crop data
        normalized[key] = value;
      } else {
        // Extract just the URL for backward compatibility
        normalized[key] = value.url || "";
      }
    } else if (Array.isArray(value)) {
      // Recursively handle arrays
      normalized[key] = value.map((item) => normalizeImageFields(item));
    } else if (value && typeof value === "object" && value !== null) {
      // Recursively handle nested objects
      normalized[key] = normalizeImageFields(value);
    }
  });

  return normalized;
};

interface MagazinePageContentProps {
  page: MagazinePage;
  issue?: MagazineIssue;
  pages?: MagazinePage[];
  onNavigate?: (pageNumber: number) => void;
}

export default function MagazinePageContent({ page, issue, pages, onNavigate }: MagazinePageContentProps) {
  const renderSection = (pageSection: MagazinePageSection) => {
    const { section, startIndex } = pageSection;

    // Normalize the content to extract URLs from image objects
    const normalizedContent = normalizeImageFields(section.content);

    // Use section.type if content.type is not available (same as MagazineIssueSection)
    const sectionType = section.content?.type || section.type;

    switch (sectionType) {
      // New Glamlink Edit sections
      case "rising-star":
        return <RisingStar content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} issueId={issue?.id} />;

      case "cover-pro-feature":
        return <CoverProFeature content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} issueId={issue?.id} />;

      case "whats-new-glamlink":
        return <WhatsNewGlamlink content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "top-treatment":
        return <TopTreatment content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} issueId={issue?.id} />;

      case "top-product-spotlight":
        return <TopProductSpotlight content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} issueId={issue?.id} />;

      case "maries-column":
        return <MariesColumn content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "maries-corner":
        return <MariesCorner title={section.title} subtitle={section.subtitle} content={normalizedContent} backgroundColor={section.backgroundColor} />;

      case "coin-drop":
        return <CoinDrop content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "glamlink-stories":
        return <GlamlinkStories content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      // Rotating sections
      case "spotlight-city":
        return <SpotlightCity content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "pro-tips":
        return <ProTips content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "event-roundup":
        return <EventRoundUp content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "whats-hot-whats-out":
        return <WhatsHotWhatsOut content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "quote-wall":
        return <QuoteWall content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} />;

      case "magazine-closing":
        return <MagazineClosing content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={section.backgroundColor} issueId={issue?.id} />;

      case "custom-section":
        return <CustomSection content={normalizedContent} title={section.title} subtitle={section.subtitle} backgroundColor={typeof section.backgroundColor === "string" ? section.backgroundColor : section.backgroundColor?.main} issueId={issue?.id} pageId={page.pageNumber} />;

      // Existing sections
      case "founder-story":
        // Magazine version shows full content
        return <FounderStory section={section} />;

      case "catalog-section":
        // Magazine version always uses the full components
        return getCatalogSectionComponent(normalizedContent.catalogType, normalizedContent.data);

      case "featured-story":
        const storyContent = normalizedContent;
        const isEditorsNote = section.title === "Editor's Note" || section.id === "editor-note";

        // Background is now handled by parent container in MagazinePageContent for Editor's Note
        // Don't apply background here
        return (
          <article className={`h-full flex flex-col ${isEditorsNote ? "p-4 lg:p-6 text-gray-900" : ""}`}>
            {/* Title */}
            <div className={`mb-4 ${isEditorsNote ? "text-gray-900" : ""}`}>
              <h2 className={`text-2xl font-bold ${isEditorsNote ? "text-gray-900" : "text-gray-900"}`}>{section.title}</h2>
              {section.subtitle && <p className={`mt-1 ${isEditorsNote ? "text-gray-900" : "text-gray-600"}`}>{section.subtitle}</p>}
            </div>

            {/* Hero Image */}
            {storyContent.heroImage && (
              <div className="relative h-64 mb-4">
                <Image src={storyContent.heroImage} alt={storyContent.heroImageAlt} fill className="object-cover rounded-lg" />
              </div>
            )}

            {/* Author and read time */}
            {(storyContent.author || storyContent.readTime) && (
              <div className={`flex items-center gap-4 text-sm mb-4 ${isEditorsNote ? "text-gray-900" : "text-gray-600"}`}>
                {storyContent.author && <span>By {storyContent.author}</span>}
                {storyContent.readTime && <span>• {storyContent.readTime}</span>}
              </div>
            )}

            {/* Body text */}
            <div className={`prose prose-sm max-w-none flex-1 ${isEditorsNote ? "prose-gray dark:prose-invert text-gray-900" : ""}`}>
              {startIndex && startIndex > 0 && <p className={`text-sm italic mb-2 ${isEditorsNote ? "text-gray-900" : "text-gray-500"}`}>Continued from previous page</p>}
              <div className={`${isEditorsNote ? "text-gray-900 magazine-main-content" : ""}`} dangerouslySetInnerHTML={{ __html: storyContent.body }} />
            </div>
          </article>
        );

      case "product-showcase":
        const productContent = normalizedContent;
        return (
          <div className="h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
            {startIndex && startIndex > 0 && <p className="text-sm text-gray-500 italic mb-2">Continued from previous page</p>}
            {productContent.theme && <p className="text-glamlink-teal font-medium mb-4">{productContent.theme}</p>}
            <div className="grid grid-cols-2 gap-3">
              {productContent.products.map((product: any) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="relative aspect-square mb-2">
                    <Image src={product.image || "/images/placeholder.png"} alt={product.name} fill className="object-cover rounded" />
                  </div>
                  <h4 className="font-semibold text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-600">{product.brandName}</p>
                  <p className="text-sm font-bold mt-1">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "beauty-tips":
        const tipsContent = section.content as any;
        return (
          <div className="h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
            {startIndex && startIndex > 0 && <p className="text-sm text-gray-500 italic mb-2">Continued from previous page</p>}
            <div className="space-y-3">
              {tipsContent.tips.map((tip: any, index: number) => (
                <div key={`tip-${index}`} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${tip.difficulty === "beginner" ? "bg-green-100 text-green-700" : tip.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{tip.difficulty}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "table-of-contents":
        // Special case for table of contents
        if (issue && pages && onNavigate) {
          return <TableOfContentsSection issue={issue} pages={pages} onNavigate={onNavigate} backgroundColor={(issue as any)?.tocBackgroundColor} />;
        }
        return null;

      case "trend-report":
        const trendContent = section.content as any;
        return (
          <div className="h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
            {startIndex && startIndex > 0 && <p className="text-sm text-gray-500 italic mb-2">Continued from previous page</p>}
            <div className="space-y-4">
              {trendContent.trends.map((trend: any, index: number) => (
                <div key={`trend-${index}`} className="bg-gray-50 rounded-lg overflow-hidden">
                  {trend.image && (
                    <div className="relative h-32">
                      <Image src={trend.image} alt={trend.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{trend.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${trend.popularity === "viral" ? "bg-red-100 text-red-700" : trend.popularity === "trending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{trend.popularity}</span>
                    </div>
                    <p className="text-sm text-gray-600">{trend.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
            {section.subtitle && <p className="text-gray-600">{section.subtitle}</p>}
          </div>
        );
    }
  };

  // Helper to apply background style
  const getBackgroundStyle = (backgroundColor?: string) => {
    if (!backgroundColor) return {};

    // Check if it's a hex color or gradient
    if (backgroundColor.startsWith("#") || backgroundColor.startsWith("linear-gradient") || backgroundColor.startsWith("radial-gradient")) {
      return { background: backgroundColor };
    }

    // Otherwise return as is (for Tailwind classes to be applied via className)
    return {};
  };

  // Helper to get background className
  const getBackgroundClass = (backgroundColor?: string) => {
    if (!backgroundColor) return "";

    // If it's a Tailwind class (starts with bg-), return it
    if (backgroundColor.startsWith("bg-")) {
      return backgroundColor;
    }

    // Otherwise use default
    return "";
  };

  // Handle cover page - display only cover image with no text
  if (page.pageNumber === 1 && page.sections[0]?.section.id === "cover") {
    const coverSection = page.sections[0].section;
    const coverContent = coverSection.content as any;
    const bgStyle = getBackgroundStyle((issue as any)?.coverBackgroundColor);
    const bgClass = getBackgroundClass((issue as any)?.coverBackgroundColor);

    // Helper to extract URL from image object or string
    const getImageUrl = (image: any): string => {
      if (!image) return '';
      if (typeof image === 'string') return image;
      return image.url || image.originalUrl || '';
    };

    // Get cover image URL - try coverBackgroundImage first, then fall back to heroImage
    const backgroundImageUrl = getImageUrl((issue as any)?.coverBackgroundImage) || getImageUrl(coverContent?.heroImage);

    // If no image at all, show a placeholder
    if (!backgroundImageUrl) {
      return (
        <div className={`w-full flex items-center justify-center ${bgClass}`} style={{ ...bgStyle, minHeight: '750px', height: '100%' }}>
          <p className="text-gray-500">No cover image set</p>
        </div>
      );
    }

    // Show only the cover image - clean, simple cover with no text
    // Image scales to fill width while maintaining aspect ratio
    return (
      <div className={`w-full h-full flex items-center justify-center ${bgClass}`} style={bgStyle}>
        <Image
          src={backgroundImageUrl}
          alt={(issue as any)?.coverImageAlt || coverContent?.heroImageAlt || 'Magazine Cover'}
          width={800}
          height={1067}
          className="w-auto h-full max-w-full object-contain"
          priority
          style={{ maxHeight: '100%' }}
        />
      </div>
    );
  }

  // Check for section type and extract appropriate background
  const firstSection = page.sections[0]?.section;
  let pageBackground = null;

  // For table-of-contents, use tocBackgroundColor from issue
  if (firstSection?.type === 'table-of-contents' || firstSection?.content?.type === 'table-of-contents') {
    pageBackground = (issue as any)?.tocBackgroundColor;
  }
  // For editor's note (featured-story with specific id/title), use editorNoteBackgroundColor
  else if ((firstSection?.type === 'featured-story' || firstSection?.content?.type === 'featured-story') &&
           (firstSection?.id === 'editor-note' || firstSection?.title === "Editor's Note")) {
    pageBackground = (issue as any)?.editorNoteBackgroundColor;
  }
  // For custom-section, the background is in content.sectionBackground
  else if (firstSection?.type === 'custom-section' || firstSection?.content?.type === 'custom-section') {
    pageBackground = (firstSection.content as any)?.sectionBackground;
  } else {
    // For other sections, use backgroundColor property
    const sectionBg = firstSection?.backgroundColor;
    pageBackground = typeof sectionBg === "object" ? sectionBg?.main : sectionBg;
  }

  // Apply background style to the entire page container
  const bgStyle = pageBackground && !pageBackground.startsWith('bg-') ? { backgroundColor: pageBackground } : {};
  const bgClass = pageBackground && pageBackground.startsWith('bg-') ? pageBackground : "";

  return (
    <div
      className={`h-full p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 ${bgClass}`}
      style={{
        ...bgStyle,
        minHeight: '750px'
      }}
    >
      {page.sections.map((pageSection, index) => {
        return (
          <div
            key={pageSection.section.id || `section-${index}`}
            className={index > 0 ? "mt-8" : ""}
          >
            {renderSection(pageSection)}
          </div>
        );
      })}
    </div>
  );
}
