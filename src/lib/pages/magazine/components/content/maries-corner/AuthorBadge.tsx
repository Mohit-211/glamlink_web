"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface AuthorBadgeProps {
  authorName: string;
  authorImage?: any;
  authorTitle?: string;
  badgeText?: string;
  badgePosition?: string;
  badgeFontSize?: string;
  badgePadding?: string;
  badgeWidth?: string;
  imageSize?: string | "small" | "medium" | "large" | "xl" | "custom";
  imageWidth?: number;
  imageHeight?: number;
  imageBackground?: string; // Deprecated - use imageBorderColor instead
  showImageBorder?: boolean;
  imageBorderColor?: string;
  imageBorderWidth?: string;
  imagePosition?: string;
  imagePositionX?: number;
  imagePositionY?: number;
  nameTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
}

// Helper function to handle background/border color styles
function getBorderColorStyle(borderColor?: string): string {
  if (!borderColor || borderColor === "transparent") {
    return "bg-transparent";
  }
  
  // Check if it's a Tailwind class
  if (borderColor.startsWith("bg-")) {
    return borderColor;
  }
  
  // Otherwise, we'll use inline styles
  return "";
}

function getInlineBorderColorStyle(borderColor?: string): React.CSSProperties {
  if (!borderColor || borderColor === "transparent" || borderColor.startsWith("bg-")) {
    return {};
  }
  
  // Handle hex, rgb, or gradient values
  return { background: borderColor };
}

export default function AuthorBadge({
  authorName,
  authorImage,
  authorTitle,
  badgeText = "FOUNDING PRO",
  badgePosition = "bottom-center",
  badgeFontSize = "text-xs",
  badgePadding = "px-3 py-1",
  badgeWidth,
  imageSize = "medium",
  imageWidth,
  imageHeight,
  imageBackground, // Deprecated
  showImageBorder = true,
  imageBorderColor = "bg-[#f5e6d3]",
  imageBorderWidth = "p-1",
  imagePosition,
  imagePositionX,
  imagePositionY,
  nameTypography = {},
  titleTypography = {}
}: AuthorBadgeProps) {
  // Define author image sizes
  const authorImageSizes = {
    small: { width: "w-12", height: "h-12" },
    medium: { width: "w-16", height: "h-16" },
    large: { width: "w-20", height: "h-20" },
    xl: { width: "w-24", height: "h-24" },
  };

  // Get author image size
  const useCustomSize = imageSize === "custom" || (imageWidth && imageHeight);
  const sizeClasses = useCustomSize
    ? { width: "", height: "" }
    : authorImageSizes[imageSize as keyof typeof authorImageSizes] || authorImageSizes.medium;

  // Get custom dimensions
  const customDimensions = useCustomSize
    ? {
        width: imageWidth || 80,
        height: imageHeight || 80,
      }
    : null;

  // Helper function to get image position
  const getImagePosition = () => {
    if (imagePosition === "custom" && imagePositionX !== undefined && imagePositionY !== undefined) {
      return `${imagePositionX}% ${imagePositionY}%`;
    }
    return imagePosition || "center";
  };

  return (
    <div className="w-full flex justify-center">
      <div className="relative flex flex-col items-center">
        {/* Container with background color */}
        <div
          className={`relative ${!useCustomSize ? `${sizeClasses.width} ${sizeClasses.height}` : ""} rounded-full ${showImageBorder ? `${getBorderColorStyle(imageBorderColor || imageBackground) || 'bg-[#f5e6d3]'} ${imageBorderWidth}` : ''}`}
          style={{
            ...(customDimensions
              ? {
                  width: `${customDimensions.width}px`,
                  height: `${customDimensions.height}px`,
                }
              : {}),
            ...(showImageBorder ? getInlineBorderColorStyle(imageBorderColor || imageBackground) : {})
          }}
        >
          {authorImage ? (
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={getImageUrl(authorImage) || "/images/placeholder.png"}
                alt={authorName}
                fill
                className={getImageObjectFit(authorImage) === "cover" ? "object-cover" : "object-contain"}
                style={{ objectPosition: getImageObjectPosition(authorImage) || getImagePosition() }}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-glamlink-purple/10 flex items-center justify-center">
              <span className="text-xl font-bold text-glamlink-purple">{authorName[0]}</span>
            </div>
          )}

          {/* Badge positioned at bottom */}
          {badgeText && (
            <div className={`absolute ${
              badgePosition === "bottom-left" ? "bottom-0 left-0" : 
              badgePosition === "bottom-right" ? "bottom-0 right-0" : 
              "bottom-0 left-1/2 transform -translate-x-1/2"
            }`}>
              <div
                className={`
                  bg-black text-white font-bold rounded whitespace-nowrap
                  ${badgeFontSize}
                  ${badgePadding}
                  ${badgeWidth === "fixed" ? "min-w-[100px] text-center" : ""}
                `}
              >
                {badgeText}
              </div>
            </div>
          )}
        </div>

        {/* Author Name and Title */}
        {(authorName || authorTitle) && (
          <div className="mt-2">
            {authorName && (
              <p
                className={`
                  ${nameTypography.fontSize || "text-sm"}
                  ${nameTypography.fontFamily || "font-sans"}
                  ${nameTypography.fontWeight || "font-medium"}
                  ${nameTypography.fontStyle || ""}
                  ${nameTypography.textDecoration || ""}
                  ${nameTypography.color || "text-gray-700"}
                  ${nameTypography.alignment === "left" ? "text-left" : 
                    nameTypography.alignment === "right" ? "text-right" : "text-center"}
                `}
              >
                {authorName}
              </p>
            )}
            {authorTitle && (
              <p
                className={`
                  ${titleTypography.fontSize || "text-xs"}
                  ${titleTypography.fontFamily || "font-sans"}
                  ${titleTypography.fontWeight || "font-normal"}
                  ${titleTypography.fontStyle || ""}
                  ${titleTypography.textDecoration || ""}
                  ${titleTypography.color || "text-gray-600"}
                  ${titleTypography.alignment === "left" ? "text-left" : 
                    titleTypography.alignment === "right" ? "text-right" : "text-center"}
                  ${authorName ? "mt-0.5" : ""}
                `}
              >
                {authorTitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}