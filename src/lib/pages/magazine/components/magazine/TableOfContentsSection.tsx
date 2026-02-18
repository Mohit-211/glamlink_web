"use client";

import { FileText, User, ShoppingBag, Star, TrendingUp, Lightbulb, Sparkles, Grid3X3, Newspaper, ArrowRight } from "lucide-react";
import { MagazineIssue, MagazinePage } from "../../types";

interface TableOfContentsSectionProps {
  issue: MagazineIssue;
  pages: MagazinePage[];
  onNavigate: (pageNumber: number) => void;
  backgroundColor?: string;
}

export default function TableOfContentsSection({ issue, pages, onNavigate, backgroundColor }: TableOfContentsSectionProps) {
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

  // Background is now handled by parent container in MagazinePageContent
  // Only apply if explicitly passed as prop (for standalone use)
  const bgStyle = backgroundColor ? getBackgroundStyle(backgroundColor) : {};
  const bgClass = backgroundColor ? getBackgroundClass(backgroundColor) : "";
  // Get icon for section type
  const getIcon = (type: string) => {
    switch (type) {
      case "featured-story":
        return <Newspaper className="w-5 h-5" />;
      case "founder-story":
        return <User className="w-5 h-5" />;
      case "product-showcase":
        return <ShoppingBag className="w-5 h-5" />;
      case "provider-spotlight":
        return <Star className="w-5 h-5" />;
      case "trend-report":
        return <TrendingUp className="w-5 h-5" />;
      case "beauty-tips":
        return <Lightbulb className="w-5 h-5" />;
      case "transformation":
        return <Sparkles className="w-5 h-5" />;
      case "catalog-section":
        return <Grid3X3 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Build content items from pages (excluding cover and TOC itself)
  const contentItems = pages
    .slice(2) // Skip cover (0) and TOC (1)
    .map((page, index) => {
      return page.sections.map(({ section }) => ({
        id: section.id,
        title: section.tocTitle || section.title,
        subtitle: section.tocSubtitle || section.subtitle,
        type: section.type,
        pageNumber: index + 2, // Adjust for skipped pages
        description: (() => {
          if (section.content.type === "featured-story" && "body" in section.content) {
            return section.content.body.substring(0, 100) + "...";
          } else if (section.content.type === "founder-story" && "story" in section.content) {
            return section.content.story.substring(0, 100) + "...";
          }
          return "";
        })(),
      }));
    })
    .flat();

  return (
    <div className={`h-full overflow-y-auto py-6 ${bgClass}`} style={bgStyle}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Table of Contents</h1>
        <div className="text-gray-600">
          <p className="text-lg">{issue.title}</p>
          <p className="text-sm mt-1">
            Issue #{issue.issueNumber} • {new Date(issue.issueDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-3">
        {contentItems.map((item, index) => (
          <button key={item.id} onClick={() => onNavigate(item.pageNumber)} className="w-full text-left group p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="hidden sm:block text-gray-400 group-hover:text-glamlink-teal transition-colors mt-0.5">{getIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 group-hover:text-glamlink-teal transition-colors leading-tight">{item.title}</h3>
                    {item.subtitle && <p className="text-glamlink-teal text-[13px] sm:text-sm mt-0.5 line-clamp-2">{item.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[13px] sm:text-xs text-gray-500 whitespace-nowrap">p. {item.pageNumber + 1}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-glamlink-teal transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
