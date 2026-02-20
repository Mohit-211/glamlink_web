'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CATEGORY_LABELS, ContentComponentInfo } from '../../config/content-discovery';
import type { BlockPickerItem } from '@/lib/pages/admin/components/magazine/web/types';
import { getPreviewImagePath, toBlockPickerItem, getCategoryIcon } from './utils';

interface ComponentCardProps {
  component: ContentComponentInfo;
  onSelect: (item: BlockPickerItem) => void;
}

export default function ComponentCard({ component, onSelect }: ComponentCardProps) {
  const [imageError, setImageError] = useState(false);
  const previewImage = getPreviewImagePath(component.category, component.name);

  const handleClick = () => {
    onSelect(toBlockPickerItem(component));
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-purple-500 hover:shadow-md transition-all duration-200 text-left group"
    >
      {/* Image Preview */}
      <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <Image
            src={previewImage}
            alt={component.displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-1">
                {getCategoryIcon(component.category)}
              </div>
              <span className="text-xs">{component.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Category Badge */}
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 mb-2 self-start">
          {CATEGORY_LABELS[component.category] || component.category}
        </span>

        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
          {component.displayName}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {component.description}
        </p>
      </div>
    </button>
  );
}
