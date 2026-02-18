"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import TypographyWrapper, { TypographySettings } from "../utils/TypographyWrapper";

interface ProInsight {
  quote?: string;
  quoteTypography?: TypographySettings;
  author?: string;
  authorTypography?: TypographySettings;
  title?: string;
  proName?: string; // Legacy field name
  proImage?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
}

interface ProInsightsProps {
  insights?: ProInsight[] | string[]; // Support both formats
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  backgroundColor?: string;
  className?: string;
}

export default function ProInsights({ 
  insights, 
  title = "Pro Insights",
  titleTypography,
  backgroundColor,
  className = "" 
}: ProInsightsProps) {
  if (!insights || insights.length === 0) return null;
  
  // Normalize insights to handle both string array and object array
  const normalizedInsights: ProInsight[] = insights.map((insight) => {
    if (typeof insight === 'string') {
      return { quote: insight };
    }
    // Handle legacy field name
    if (insight.proName && !insight.author) {
      return { ...insight, author: insight.proName };
    }
    return insight;
  });
  
  // Build typography classes
  const getTitleClasses = () => {
    if (!titleTypography) return "text-xl md:text-2xl font-sans font-bold text-gray-900";
    const classes = [];
    if (titleTypography.fontSize) {
      // Handle responsive font sizes
      if (titleTypography.fontSize === "text-xl") {
        classes.push("text-xl md:text-2xl");
      } else {
        classes.push(titleTypography.fontSize);
      }
    } else {
      classes.push("text-xl md:text-2xl");
    }
    if (titleTypography.fontFamily) classes.push(titleTypography.fontFamily);
    if (titleTypography.fontWeight) classes.push(titleTypography.fontWeight);
    if (titleTypography.fontStyle) classes.push(titleTypography.fontStyle);
    if (titleTypography.textDecoration) classes.push(titleTypography.textDecoration);
    if (titleTypography.color) classes.push(titleTypography.color);
    if (titleTypography.alignment === "center") classes.push("text-center");
    if (titleTypography.alignment === "right") classes.push("text-right");
    if (titleTypography.alignment === "justify") classes.push("text-justify");
    return classes.join(" ") || "text-xl md:text-2xl font-sans font-bold text-gray-900";
  };
  
  // Determine background
  const backgroundStyle: React.CSSProperties = {};
  let backgroundClass = "bg-gray-50";
  
  if (backgroundColor) {
    if (backgroundColor.startsWith("#") || backgroundColor.startsWith("rgb")) {
      backgroundStyle.background = backgroundColor;
      backgroundClass = "";
    } else if (backgroundColor.startsWith("linear-gradient") || backgroundColor.startsWith("radial-gradient")) {
      backgroundStyle.background = backgroundColor;
      backgroundClass = "";
    } else if (backgroundColor.startsWith("bg-")) {
      backgroundClass = backgroundColor;
    }
  }
  
  return (
    <div className={`mb-6 rounded-lg p-2 sm:p-4 md:p-6 ${backgroundClass} ${className}`} style={backgroundStyle}>
      <h4 className={`mb-3 ${getTitleClasses()}`}>{title}</h4>
      
      <div className="space-y-3">
        {normalizedInsights.map((insight, index) => {
          const imageUrl = insight.proImage ? getImageUrl(insight.proImage) : null;
          
          return (
            <div key={index} className="rounded-lg p-2 sm:p-3 md:p-4 bg-white">
              <div className="flex items-start">
                {imageUrl && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image
                      src={imageUrl}
                      alt={insight.author || "Professional"}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: typeof insight.proImage === 'object' && insight.proImage.objectPositionX !== undefined && insight.proImage.objectPositionY !== undefined
                          ? `${insight.proImage.objectPositionX}% ${insight.proImage.objectPositionY}%`
                          : '50% 50%'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  {insight.author && (
                    <TypographyWrapper
                      settings={insight.authorTypography}
                      defaultSettings={{
                        fontWeight: "font-medium",
                        color: "text-gray-900"
                      }}
                      className="mb-1"
                      as="div"
                    >
                      {insight.author}
                    </TypographyWrapper>
                  )}
                  {insight.quote && (
                    <TypographyWrapper
                      settings={insight.quoteTypography}
                      defaultSettings={{
                        fontSize: "text-sm",
                        color: "text-gray-600",
                        fontStyle: "italic"
                      }}
                      as="p"
                    >
                      "{insight.quote}"
                    </TypographyWrapper>
                  )}
                  {insight.title && !insight.author && (
                    <div className="text-sm text-gray-600 mt-1">
                      {insight.title}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}