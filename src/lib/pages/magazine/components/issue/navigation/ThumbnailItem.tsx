'use client';

import React from 'react';
import Image from 'next/image';
import type { ThumbnailItemProps } from '../../../types';

/**
 * ThumbnailItem - Individual thumbnail in the navigation strip
 *
 * Displays a thumbnail image with page number at top and title at bottom.
 * Shows active state styling when current page.
 */
export function ThumbnailItem({ page, isActive, onClick }: ThumbnailItemProps) {
  // Get fallback text (first letter of title or page type)
  const getFallbackText = () => {
    if (page.type === 'cover') return 'C';
    if (page.type === 'toc') return 'T';
    if (page.type === 'editors-note') return 'E';
    return page.title.charAt(0).toUpperCase();
  };

  // Get type label for accessibility and display
  const getTypeLabel = () => {
    switch (page.type) {
      case 'cover': return 'Cover';
      case 'toc': return 'Contents';
      case 'editors-note': return "Editor's Note";
      case 'section': return page.title;
      default: return `Page ${page.pid + 1}`;
    }
  };

  // Get short label for display on thumbnail
  const getShortLabel = () => {
    const label = getTypeLabel();
    // Truncate long titles
    return label.length > 20 ? label.substring(0, 18) + '...' : label;
  };

  return (
    <button
      onClick={onClick}
      data-pid={page.pid}
      className={`
        relative group cursor-pointer transition-all duration-200 w-full rounded-lg
        ${isActive
          ? 'ring-2 ring-glamlink-teal ring-offset-2 scale-[1.02] z-10'
          : 'hover:scale-[1.02] hover:ring-2 hover:ring-glamlink-teal/50 hover:ring-offset-2'
        }
      `}
      aria-label={`Go to ${getTypeLabel()}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Thumbnail container */}
      <div
        className={`
          w-full aspect-[3/4] rounded-lg overflow-hidden relative
          ${isActive ? 'shadow-lg' : 'shadow-sm'}
          bg-gray-100
        `}
      >
        {page.thumbnail ? (
          <Image
            src={page.thumbnail}
            alt={getTypeLabel()}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 22vw, (max-width: 768px) 20vw, 150px"
          />
        ) : (
          // Fallback when no thumbnail
          <div
            className={`
              w-full h-full flex items-center justify-center
              ${page.type === 'cover' ? 'bg-gradient-to-br from-glamlink-purple to-glamlink-teal' : ''}
              ${page.type === 'toc' ? 'bg-gradient-to-br from-gray-600 to-gray-800' : ''}
              ${page.type === 'editors-note' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : ''}
              ${page.type === 'section' ? 'bg-gradient-to-br from-gray-400 to-gray-600' : ''}
            `}
          >
            <span className="text-white text-lg md:text-xl font-bold">
              {getFallbackText()}
            </span>
          </div>
        )}

        {/* Hover overlay - glamlink-teal tint */}
        <div className="absolute inset-0 bg-glamlink-teal/0 group-hover:bg-glamlink-teal/20 transition-colors duration-200 rounded-lg" />

        {/* Page number indicator - TOP right */}
        <div
          className={`
            absolute top-1 right-1 w-5 h-5 md:w-6 md:h-6 rounded-full text-[10px] md:text-xs font-bold
            flex items-center justify-center shadow-sm z-10
            ${isActive
              ? 'bg-glamlink-teal text-white'
              : 'bg-white/95 text-gray-700'
            }
          `}
        >
          {page.pid + 1}
        </div>

        {/* Title label - BOTTOM with gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-6 pb-1.5 px-1.5 z-10">
          <p className="text-white text-[10px] md:text-xs font-medium text-center leading-tight line-clamp-2">
            {getShortLabel()}
          </p>
        </div>
      </div>
    </button>
  );
}

export default ThumbnailItem;
