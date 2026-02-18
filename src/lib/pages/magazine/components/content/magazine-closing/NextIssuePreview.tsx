"use client";

import Image from "next/image";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import { BackgroundWrapper } from "../shared";

interface UpcomingHighlight {
  image?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  title: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  description?: string;
  descriptionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
}

interface NextIssuePreviewProps {
  title: string;
  date?: string;
  description?: string;
  coverImage?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  titleTypography?: any;
  backgroundColor?: any;
  upcomingHighlights?: UpcomingHighlight[];
  upcomingHighlightsTitle?: string;
  upcomingHighlightsTitleTypography?: any;
  upcomingHighlightsBackgroundColor?: string;
  section?: string;
  className?: string;
}

export default function NextIssuePreview({
  title,
  date,
  description,
  coverImage,
  titleTypography,
  backgroundColor,
  upcomingHighlights,
  upcomingHighlightsTitle,
  upcomingHighlightsTitleTypography,
  upcomingHighlightsBackgroundColor,
  section = "nextIssue",
  className = ""
}: NextIssuePreviewProps) {
  const imageUrl = coverImage ? getImageUrl(coverImage) : null;
  const objectFit = coverImage ? getImageObjectFit(coverImage as any) : 'cover';
  const objectPosition = coverImage ? getImageObjectPosition(coverImage as any) : 'center';
  
  // Helper function to determine background styling
  const getBackgroundStyle = (bgColor?: string) => {
    if (!bgColor) return {};
    
    // Check if it's a Tailwind class
    if (bgColor.startsWith("bg-") || bgColor.includes(" bg-")) {
      return { className: bgColor };
    }
    
    // Check if it's a gradient
    if (bgColor.startsWith("linear-gradient") || bgColor.startsWith("radial-gradient")) {
      return { style: { background: bgColor } };
    }
    
    // Otherwise treat as a color value
    return { style: { backgroundColor: bgColor } };
  };
  
  const highlightBgProps = getBackgroundStyle(upcomingHighlightsBackgroundColor);
  
  return (
    <div className={className}>
      <BackgroundWrapper 
        backgroundColor={backgroundColor} 
        section={section}
        className={`flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-lg p-8 mb-12`}
      >
        {imageUrl && (
          <div className="relative w-full md:w-1/3 aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={objectFit === "cover" ? "object-cover" : "object-contain"}
              style={{
                objectPosition: objectPosition,
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <h3
            className={`
            ${titleTypography?.fontSize || "text-2xl"}
            ${titleTypography?.fontFamily || "font-sans"}
            ${titleTypography?.fontWeight || "font-bold"}
            ${titleTypography?.fontStyle || ""}
            ${titleTypography?.textDecoration || ""}
            ${titleTypography?.color || "text-gray-900"}
            ${titleTypography?.alignment || ""}
            mb-2
          `}
          >
            {title}
          </h3>
          {date && <p className="text-gray-600 mb-4">Coming {formatMagazineDate(date)}</p>}
          {description ? (
            <div className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p className="text-lg text-gray-700">Don't miss our next issue featuring exclusive interviews, trending treatments, and the hottest beauty products.</p>
          )}
        </div>
      </BackgroundWrapper>
      
      {/* Upcoming Highlights Section */}
      {upcomingHighlights && upcomingHighlights.length > 0 && (
        <div>
          {upcomingHighlightsTitle && (
            <h3
              className={`
              ${upcomingHighlightsTitleTypography?.fontSize || "text-2xl"}
              ${upcomingHighlightsTitleTypography?.fontFamily || "font-sans"}
              ${upcomingHighlightsTitleTypography?.fontWeight || "font-bold"}
              ${upcomingHighlightsTitleTypography?.fontStyle || ""}
              ${upcomingHighlightsTitleTypography?.textDecoration || ""}
              ${upcomingHighlightsTitleTypography?.color || "text-gray-900"}
              ${upcomingHighlightsTitleTypography?.alignment === "center" ? "text-center" : 
                upcomingHighlightsTitleTypography?.alignment === "right" ? "text-right" : 
                upcomingHighlightsTitleTypography?.alignment === "justify" ? "text-justify" : ""}
              mb-6
            `}
            >
              {upcomingHighlightsTitle}
            </h3>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingHighlights.map((highlight, index) => {
              const highlightImageUrl = highlight.image ? getImageUrl(highlight.image) : null;
              const highlightObjectFit = highlight.image ? getImageObjectFit(highlight.image as any) : 'cover';
              const highlightObjectPosition = highlight.image ? getImageObjectPosition(highlight.image as any) : 'center';
              
              return (
                <div 
                  key={index} 
                  className={`rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
                    highlightBgProps.className || 'bg-white'
                  }`}
                  style={highlightBgProps.style}
                >
                  {highlightImageUrl && (
                    <div className="relative h-48">
                      <Image
                        src={highlightImageUrl}
                        alt={highlight.title}
                        fill
                        className={highlightObjectFit === "cover" ? "object-cover" : "object-contain"}
                        style={{
                          objectPosition: highlightObjectPosition,
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className={`
                      ${highlight.titleTypography?.fontSize || "text-base"}
                      ${highlight.titleTypography?.fontFamily || "font-sans"}
                      ${highlight.titleTypography?.fontWeight || "font-bold"}
                      ${highlight.titleTypography?.fontStyle || ""}
                      ${highlight.titleTypography?.textDecoration || ""}
                      ${highlight.titleTypography?.color || "text-gray-900"}
                      ${highlight.titleTypography?.alignment === "center" ? "text-center" : 
                        highlight.titleTypography?.alignment === "right" ? "text-right" : 
                        highlight.titleTypography?.alignment === "justify" ? "text-justify" : ""}
                      mb-2
                    `}>
                      {highlight.title}
                    </h4>
                    {highlight.description && (
                      <p className={`
                        ${highlight.descriptionTypography?.fontSize || "text-sm"}
                        ${highlight.descriptionTypography?.fontFamily || "font-sans"}
                        ${highlight.descriptionTypography?.fontWeight || "font-normal"}
                        ${highlight.descriptionTypography?.fontStyle || ""}
                        ${highlight.descriptionTypography?.textDecoration || ""}
                        ${highlight.descriptionTypography?.color || "text-gray-600"}
                        ${highlight.descriptionTypography?.alignment === "center" ? "text-center" : 
                          highlight.descriptionTypography?.alignment === "right" ? "text-right" : 
                          highlight.descriptionTypography?.alignment === "justify" ? "text-justify" : ""}
                      `}>
                        {highlight.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}