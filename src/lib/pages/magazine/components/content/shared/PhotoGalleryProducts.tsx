"use client";

import React from 'react';
import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface ProductItem {
  image?: any;
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

interface PhotoGalleryProductsProps {
  products?: ProductItem[];
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
  columns?: number | string;
  imageStyling?: string;
  cardBackgroundColor?: string;
  className?: string;
}

export default function PhotoGalleryProducts({ 
  products, 
  title,
  titleTypography,
  columns = "responsive",
  imageStyling = "same-height",
  cardBackgroundColor,
  className = ""
}: PhotoGalleryProductsProps) {
  
  if (!products || products.length === 0) return null;

  // Check if responsive columns is selected
  const isResponsive = columns === 'responsive';
  
  // Convert columns to number if it's a string (and not 'responsive')
  const columnCount = isResponsive ? 0 : (typeof columns === 'string' ? parseInt(columns, 10) : columns);
  
  // Check if auto-height mode is enabled
  const isAutoHeight = imageStyling === "auto-height";
  
  // Set grid classes based on column setting
  // Auto-height only affects mobile/tablet, not desktop
  const gridCols = isResponsive 
    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
    : columnCount === 1 ? "" : columnCount === 2 ? "grid-cols-2" : columnCount === 3 ? "grid-cols-3" : "grid-cols-4";

  // Build title classes from typography settings
  const getTitleClasses = () => {
    if (!titleTypography) return "text-2xl font-bold text-gray-900 mb-6";
    const classes = [];
    if (titleTypography.fontSize) classes.push(titleTypography.fontSize);
    if (titleTypography.fontFamily) classes.push(titleTypography.fontFamily);
    if (titleTypography.fontWeight) classes.push(titleTypography.fontWeight);
    if (titleTypography.fontStyle) classes.push(titleTypography.fontStyle);
    if (titleTypography.textDecoration) classes.push(titleTypography.textDecoration);
    if (titleTypography.color) classes.push(titleTypography.color);
    if (titleTypography.alignment === "center") classes.push("text-center");
    if (titleTypography.alignment === "right") classes.push("text-right");
    if (titleTypography.alignment === "justify") classes.push("text-justify");
    classes.push("mb-6");
    return classes.join(" ") || "text-2xl font-bold text-gray-900 mb-6";
  };

  // Build typography classes for product text
  const getTypographyClasses = (typography: any, defaults: string = "") => {
    if (!typography) return defaults;
    const classes = [];
    if (typography.fontSize) classes.push(typography.fontSize);
    if (typography.fontFamily) classes.push(typography.fontFamily);
    if (typography.fontWeight) classes.push(typography.fontWeight);
    if (typography.fontStyle) classes.push(typography.fontStyle);
    if (typography.textDecoration) classes.push(typography.textDecoration);
    if (typography.color) classes.push(typography.color);
    if (typography.alignment === "center") classes.push("text-center");
    if (typography.alignment === "right") classes.push("text-right");
    if (typography.alignment === "justify") classes.push("text-justify");
    return classes.join(" ") || defaults;
  };

  // Determine card background
  const getCardBackground = () => {
    if (!cardBackgroundColor) return "bg-white";
    
    // Check if it's a Tailwind class
    if (cardBackgroundColor.startsWith("bg-")) {
      return cardBackgroundColor;
    }
    
    // Return empty class if it's a hex/rgb/gradient (will use inline style)
    return "";
  };

  const getCardStyle = () => {
    if (!cardBackgroundColor) return {};
    
    // Apply as inline style if it's hex, rgb, or gradient
    if (cardBackgroundColor.startsWith("#") || cardBackgroundColor.startsWith("rgb")) {
      return { backgroundColor: cardBackgroundColor };
    } else if (cardBackgroundColor.startsWith("linear-gradient") || cardBackgroundColor.startsWith("radial-gradient")) {
      return { background: cardBackgroundColor };
    }
    
    return {};
  };

  const cardBgClass = getCardBackground();
  const cardStyle = getCardStyle();

  return (
    <div className={className}>
      {title && (
        <h3 className={getTitleClasses()}>{title}</h3>
      )}
      
      <div className={`${columnCount === 1 ? "space-y-4" : `grid ${gridCols} gap-4`}`}>
        {products.map((product, index) => {
          const imageUrl = product.image ? getImageUrl(product.image) : null;
          
          return (
            <div 
              key={index} 
              className={`${cardBgClass} rounded-lg shadow-sm overflow-hidden`}
              style={cardStyle}
            >
              {/* Product Image */}
              {imageUrl && (
                isAutoHeight ? (
                  // Auto height mode: Natural aspect ratio on mobile/tablet, square on desktop
                  <>
                    {/* Mobile/Tablet view (md and below): Auto height */}
                    <div className="md:hidden relative bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={product.title || `Product ${index + 1}`}
                        className="w-full h-auto"
                        style={{
                          display: "block",
                          objectPosition: getImageObjectPosition(product.image),
                        }}
                      />
                    </div>
                    
                    {/* Desktop view (above md): Square aspect ratio */}
                    <div className="hidden md:block relative aspect-square bg-gray-50">
                      <Image
                        src={imageUrl}
                        alt={product.title || `Product ${index + 1}`}
                        fill
                        className={getImageObjectFit(product.image) === "cover" ? "object-cover" : "object-contain"}
                        style={{
                          objectPosition: getImageObjectPosition(product.image),
                        }}
                      />
                    </div>
                  </>
                ) : (
                  // Same height mode: Always square aspect ratio
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={imageUrl}
                      alt={product.title || `Product ${index + 1}`}
                      fill
                      className={getImageObjectFit(product.image) === "cover" ? "object-cover" : "object-contain"}
                      style={{
                        objectPosition: getImageObjectPosition(product.image),
                      }}
                    />
                  </div>
                )
              )}
              
              {/* Product Text Content */}
              <div className="p-4">
                {/* Product Title */}
                {product.title && (
                  <h4 className={getTypographyClasses(
                    product.titleTypography,
                    "text-lg font-semibold text-gray-900 mb-2"
                  )}>
                    {product.title}
                  </h4>
                )}
                
                {/* Product Description */}
                {product.description && (
                  <p className={getTypographyClasses(
                    product.descriptionTypography,
                    "text-sm text-gray-600"
                  )}>
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}