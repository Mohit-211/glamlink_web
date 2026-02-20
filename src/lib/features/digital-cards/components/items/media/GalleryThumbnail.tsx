"use client";

import { useState } from "react";
import { Play, ImageIcon } from "lucide-react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

interface GalleryThumbnailProps {
  item: GalleryItem;
  isActive: boolean;
  onClick: () => void;
  size?: number;
}

export default function GalleryThumbnail({
  item,
  isActive,
  onClick,
  size = 64,
}: GalleryThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  const isVideo = item.type === 'video';
  const thumbnailUrl = item.thumbnail || item.url || item.src;

  // For videos without thumbnails, we'll show a play icon on gray background
  const showVideoPlaceholder = isVideo && (!thumbnailUrl || imageError);
  // For images that fail to load
  const showImagePlaceholder = !isVideo && (!thumbnailUrl || imageError);

  return (
    <button
      onClick={onClick}
      className={`
        relative flex-shrink-0 rounded-lg overflow-hidden
        transition-all duration-200 ease-in-out
        hover:scale-105 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2
        ${isActive
          ? 'ring-2 ring-glamlink-teal ring-offset-2 shadow-md'
          : 'ring-1 ring-gray-200'
        }
      `}
      style={{ width: size, height: size }}
      aria-label={`View ${item.title || (isVideo ? 'video' : 'image')}`}
      aria-pressed={isActive}
    >
      {/* Video placeholder with play icon */}
      {showVideoPlaceholder && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      )}

      {/* Image placeholder */}
      {showImagePlaceholder && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}

      {/* Actual thumbnail image */}
      {thumbnailUrl && !imageError && (
        <img
          src={thumbnailUrl}
          alt={item.title || item.caption || (isVideo ? 'Video thumbnail' : 'Image thumbnail')}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {/* Video play overlay (when showing actual thumbnail) */}
      {isVideo && thumbnailUrl && !imageError && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
            <Play className="w-4 h-4 text-gray-800 fill-gray-800 ml-0.5" />
          </div>
        </div>
      )}

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 rounded-full bg-glamlink-teal" />
        </div>
      )}
    </button>
  );
}
