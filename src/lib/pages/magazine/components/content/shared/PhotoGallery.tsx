"use client";

import React from 'react';
import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface Photo {
  image?: any;
  url?: any;
  title?: string;
  caption?: string;
  description?: string;
  alt?: string;
}

interface PhotoGalleryProps {
  photos?: Photo[] | { photos?: Photo[]; images?: Photo[]; title?: string };
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
    tag?: string;
  };
  className?: string;
  columns?: number | string;
  imageStyling?: string;
}

export default function PhotoGallery({
  photos,
  title,
  titleTypography,
  className = "",
  columns = 1,
  imageStyling = "same-height"
}: PhotoGalleryProps) {
  // Get tag from typography settings
  const titleTag = titleTypography?.tag || "h3";
  // Handle different photo gallery formats
  let photoArray: Photo[] = [];
  let galleryTitle = title;
  
  if (photos) {
    if (Array.isArray(photos)) {
      photoArray = photos;
    } else if (typeof photos === 'object') {
      photoArray = photos.photos || photos.images || [];
      galleryTitle = title || photos.title || "Photo Gallery";
    }
  }

  if (!photoArray || photoArray.length === 0) return null;

  // Check if responsive columns is selected
  const isResponsive = columns === 'responsive';
  
  // Convert columns to number if it's a string (and not 'responsive')
  const columnCount = isResponsive ? 0 : (typeof columns === 'string' ? parseInt(columns, 10) : columns);
  
  // Set grid classes based on column setting
  const gridCols = isResponsive 
    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
    : columnCount === 1 ? "" : columnCount === 2 ? "grid-cols-2" : "grid-cols-3";

  // Build title classes from typography settings
  const titleClasses = [
    titleTypography?.fontSize || "text-lg",
    titleTypography?.fontFamily || "font-sans",
    titleTypography?.fontWeight || "font-bold",
    titleTypography?.fontStyle || "",
    titleTypography?.textDecoration || "",
    titleTypography?.color || "text-gray-900",
    titleTypography?.alignment === "left" ? "text-left" : 
      titleTypography?.alignment === "right" ? "text-right" : 
      titleTypography?.alignment === "center" ? "text-center" : "text-left",
    "mb-4"
  ].filter(Boolean).join(" ");

  // Render the heading with dynamic tag
  const renderHeading = () => {
    if (!galleryTitle) return null;
    
    switch (titleTag) {
      case 'h1':
        return <h1 className={titleClasses}>{galleryTitle}</h1>;
      case 'h2':
        return <h2 className={titleClasses}>{galleryTitle}</h2>;
      case 'h4':
        return <h4 className={titleClasses}>{galleryTitle}</h4>;
      case 'h5':
        return <h5 className={titleClasses}>{galleryTitle}</h5>;
      case 'h6':
        return <h6 className={titleClasses}>{galleryTitle}</h6>;
      case 'h3':
      default:
        return <h3 className={titleClasses}>{galleryTitle}</h3>;
    }
  };

  return (
    <div className={`rounded-lg p-6 ${className}`}>
      {renderHeading()}
      <div className={`${isResponsive || columnCount > 1 ? `grid ${gridCols} gap-3` : "space-y-3"}`}>
        {photoArray.map((photo, index) => {
          const imageData = photo.image || photo.url;
          if (!imageData) return null;
          
          // For responsive mode: use auto-height on mobile, respect imageStyling on larger screens
          const isAutoHeight = isResponsive 
            ? imageStyling === "auto-height" 
            : imageStyling === "auto-height";
          
          return (
            <div key={index} className="group relative">
              {isResponsive ? (
                // Responsive mode: Different rendering for mobile vs desktop
                <>
                  {/* Mobile view (auto-height) */}
                  <div className="md:hidden relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={getImageUrl(imageData) || "/images/placeholder.png"}
                      alt={photo.alt || photo.title || `Photo ${index + 1}`}
                      className="w-full h-auto"
                      style={{
                        display: "block",
                        objectPosition: getImageObjectPosition(imageData),
                      }}
                    />
                    {/* Overlay with title and description on hover */}
                    {(photo.title || photo.caption || photo.description) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          {(photo.title || photo.caption) && (
                            <h4 className="font-semibold text-sm mb-1">
                              {photo.title || photo.caption}
                            </h4>
                          )}
                          {photo.description && (
                            <p className="text-xs opacity-90 line-clamp-2">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop view (respects imageStyling setting) */}
                  <div className="hidden md:block">
                    {imageStyling === "auto-height" ? (
                      // Auto height for desktop
                      <div className="relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={getImageUrl(imageData) || "/images/placeholder.png"}
                          alt={photo.alt || photo.title || `Photo ${index + 1}`}
                          className="w-full h-auto"
                          style={{
                            display: "block",
                            objectPosition: getImageObjectPosition(imageData),
                          }}
                        />
                        {/* Overlay */}
                        {(photo.title || photo.caption || photo.description) && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              {(photo.title || photo.caption) && (
                                <h4 className="font-semibold text-sm mb-1">
                                  {photo.title || photo.caption}
                                </h4>
                              )}
                              {photo.description && (
                                <p className="text-xs opacity-90 line-clamp-2">{photo.description}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Same height (square) for desktop
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                        <Image
                          src={getImageUrl(imageData) || "/images/placeholder.png"}
                          alt={photo.alt || photo.title || `Photo ${index + 1}`}
                          fill
                          className={getImageObjectFit(imageData) === "cover" ? "object-cover" : "object-contain"}
                          style={{
                            objectPosition: getImageObjectPosition(imageData),
                          }}
                        />
                        {/* Overlay */}
                        {(photo.title || photo.caption || photo.description) && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              {(photo.title || photo.caption) && (
                                <h4 className="font-semibold text-sm mb-1">
                                  {photo.title || photo.caption}
                                </h4>
                              )}
                              {photo.description && (
                                <p className="text-xs opacity-90 line-clamp-2">{photo.description}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Non-responsive mode: Original behavior
                isAutoHeight ? (
                  // Auto height: Natural aspect ratio
                  <div className="relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={getImageUrl(imageData) || "/images/placeholder.png"}
                      alt={photo.alt || photo.title || `Photo ${index + 1}`}
                      className="w-full h-auto"
                      style={{
                        display: "block",
                      }}
                    />
                    {/* Overlay with title and description on hover */}
                    {(photo.title || photo.caption || photo.description) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          {(photo.title || photo.caption) && (
                            <h4 className="font-semibold text-sm mb-1">
                              {photo.title || photo.caption}
                            </h4>
                          )}
                          {photo.description && (
                            <p className="text-xs opacity-90 line-clamp-2">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Same height: Square aspect ratio
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <Image
                      src={getImageUrl(imageData) || "/images/placeholder.png"}
                      alt={photo.alt || photo.title || `Photo ${index + 1}`}
                      fill
                      className={getImageObjectFit(imageData) === "cover" ? "object-cover" : "object-contain"}
                      style={{
                        objectPosition: getImageObjectPosition(imageData),
                      }}
                    />
                    {/* Overlay with title and description on hover */}
                    {(photo.title || photo.caption || photo.description) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          {(photo.title || photo.caption) && (
                            <h4 className="font-semibold text-sm mb-1">
                              {photo.title || photo.caption}
                            </h4>
                          )}
                          {photo.description && (
                            <p className="text-xs opacity-90 line-clamp-2">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}