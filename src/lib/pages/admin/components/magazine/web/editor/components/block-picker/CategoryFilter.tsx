'use client';

import React from 'react';
import { CATEGORY_LABELS, getAllCategories } from '../../config/content-discovery';
import { getCategoryIcon } from './utils';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = getAllCategories();

  return (
    <div className="flex flex-wrap gap-2">
      {/* All Category */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
          selectedCategory === 'all'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Components
      </button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === category
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {getCategoryIcon(category)} {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}
