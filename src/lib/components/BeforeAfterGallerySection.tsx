"use client";

import { useState } from "react";
import SafeImage from "@/lib/components/SafeImage";
import BeforeAfterSlider from "./BeforeAfterSlider";

// Type for images that can be either strings or objects
type ImageType = string | { url: string; altText?: string };

interface BeforeAfterGallerySectionProps {
  beforeImagePrimary?: string;
  beforeImages?: ImageType[];
  afterImagePrimary?: string;
  afterImages?: ImageType[];
  productName: string;
}

export default function BeforeAfterGallerySection({
  beforeImagePrimary,
  beforeImages = [],
  afterImagePrimary,
  afterImages = [],
  productName
}: BeforeAfterGallerySectionProps) {
  const [viewMode, setViewMode] = useState<"gallery" | "slider">("slider");
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  const [selectedBeforeIndex, setSelectedBeforeIndex] = useState(0);
  const [selectedAfterIndex, setSelectedAfterIndex] = useState(0);

  // Helper function to normalize images to string URLs
  const normalizeImage = (img: ImageType): string => {
    if (typeof img === 'string') return img;
    return img.url || '';
  };

  // Get all before images
  const allBeforeImages = [
    ...(beforeImagePrimary ? [beforeImagePrimary] : []),
    ...beforeImages.map(normalizeImage)
  ].filter(img => img && img.trim() !== '');

  // Get all after images
  const allAfterImages = [
    ...(afterImagePrimary ? [afterImagePrimary] : []),
    ...afterImages.map(normalizeImage)
  ].filter(img => img && img.trim() !== '');

  // Get images for current tab (gallery mode)
  const allImages = activeTab === "before" ? allBeforeImages : allAfterImages;

  if (!beforeImagePrimary && !afterImagePrimary) {
    return null;
  }

  // Get selected images for slider
  const selectedBeforeImage = allBeforeImages[selectedBeforeIndex] || allBeforeImages[0];
  const selectedAfterImage = allAfterImages[selectedAfterIndex] || allAfterImages[0];

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header with View Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Before & After Gallery</h2>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("slider")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "slider" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Slider View
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "gallery" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Gallery View
            </button>
          </div>
        </div>

        {/* Tabs for Gallery Mode */}
        {viewMode === "gallery" && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("before")}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "before"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Before
              {activeTab === "before" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("after")}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "after"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              After
              {activeTab === "after" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content based on view mode */}
      {viewMode === "slider" ? (
        <div className="space-y-6">
          {/* Slider */}
          {selectedBeforeImage && selectedAfterImage && (
            <BeforeAfterSlider
              key={`${selectedBeforeIndex}-${selectedAfterIndex}`}
              beforeImage={selectedBeforeImage}
              afterImage={selectedAfterImage}
              beforeAlt={`${productName} - Before`}
              afterAlt={`${productName} - After`}
              height={400}
            />
          )}

          {/* Image Selection Thumbnails */}
          <div className="space-y-4">
            {/* Before Images */}
            {allBeforeImages.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Select Before Image:</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allBeforeImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedBeforeIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedBeforeIndex === index 
                          ? "border-indigo-600 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`Before option ${index + 1}`}
                        fill
                        className="object-cover"
                        fallbackType="transformation"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* After Images */}
            {allAfterImages.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Select After Image:</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allAfterImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAfterIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedAfterIndex === index 
                          ? "border-indigo-600 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`After option ${index + 1}`}
                        fill
                        className="object-cover"
                        fallbackType="transformation"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Gallery View */
        allImages.length > 0 ? (
          <div key={activeTab} className="transition-opacity duration-300">
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-2">
                {allImages.map((img, index) => (
                  <div key={`${activeTab}-${index}`} className="relative flex-shrink-0 animate-fadeIn">
                    <div className="relative w-64 h-64 rounded-lg overflow-hidden bg-gray-100">
                      <SafeImage
                        src={img}
                        alt={`${productName} - ${activeTab} image ${index + 1}`}
                        fill
                        className="object-cover"
                        fallbackType="transformation"
                      />
                      {/* Primary Badge with tab-specific color */}
                      {index === 0 && (
                        <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${
                          activeTab === "before" ? "bg-gray-600" : "bg-indigo-600"
                        }`}>
                          Primary {activeTab === "before" ? "Before" : "After"}
                        </span>
                      )}
                      {/* Tab indicator */}
                      <span className={`absolute bottom-2 right-2 text-white text-xs px-2 py-1 rounded ${
                        activeTab === "before" ? "bg-black/50" : "bg-indigo-600/70"
                      }`}>
                        {activeTab === "before" ? "Before" : "After"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {allImages.length > 3 && (
                <p className="text-sm text-gray-500 mt-2">Scroll horizontally to see more images →</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} images available for this product
          </div>
        )
      )}

      {/* Product Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          These transformation images showcase the results achieved with <span className="font-semibold">{productName}</span>.
          Individual results may vary based on skin type and consistent product usage.
        </p>
      </div>
    </div>
    </>
  );
}