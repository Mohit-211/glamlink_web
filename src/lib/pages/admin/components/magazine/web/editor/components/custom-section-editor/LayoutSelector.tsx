'use client';

import React from 'react';
import type { CustomSectionLayout } from '@/lib/pages/admin/components/magazine/web/types';

interface LayoutSelectorProps {
  layout: CustomSectionLayout;
  onChange: (layout: CustomSectionLayout) => void;
}

export default function LayoutSelector({ layout, onChange }: LayoutSelectorProps) {
  const layouts: { value: CustomSectionLayout; label: string; icon: string }[] = [
    { value: 'single-column', label: 'Single Column', icon: '▢' },
    { value: 'two-column', label: 'Two Columns', icon: '▢▢' },
    { value: 'grid-3', label: '3-Column Grid', icon: '▢▢▢' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Layout:</span>
      <div className="flex gap-1">
        {layouts.map((l) => (
          <button
            key={l.value}
            onClick={() => onChange(l.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              layout === l.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={l.label}
          >
            {l.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
