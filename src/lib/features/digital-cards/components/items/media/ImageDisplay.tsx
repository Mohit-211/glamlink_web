"use client";

import { useState } from "react";
import { Loader2, Maximize2 } from "lucide-react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

interface ImageDisplayProps {
  image: GalleryItem;
  className?: string;
}

export default function ImageDisplay({
  image,
  className = "",
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const imageUrl = image.url || image.src;

  const handleError = () => {
    setError("Failed to load image");
    setIsLoading(false);
  };

  const handleFullscreen = () => {
    // Open image in new tab for fullscreen view
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  // Use caption if available, fallback to title for display
  const displayText = image.caption || image.title;

  return (
    <div className={`image-display ${className}`}>
      {/* Image Caption as Title (semibold, above image) */}
      {displayText && (
        <div className="mb-3 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{displayText}</h3>
        </div>
      )}

      {/* Image Content - full width, max height 800px */}
      <div className="w-full flex justify-center">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden max-h-[800px]">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={image.title || image.caption || "Gallery image"}
                className="max-h-[800px] w-auto h-auto object-contain"
                onLoad={() => setIsLoading(false)}
                onError={handleError}
              />

              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="w-8 h-8 text-glamlink-teal animate-spin" />
                </div>
              )}

              {/* Fullscreen Button */}
              {!isLoading && !error && (
                <button
                  onClick={handleFullscreen}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-8 bg-gray-100">
              <p className="text-gray-500">No image available</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-center p-4">
                <p className="text-red-600 mb-2">Image unavailable</p>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Tags */}
      {image.tags && image.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {image.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal-dark text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
