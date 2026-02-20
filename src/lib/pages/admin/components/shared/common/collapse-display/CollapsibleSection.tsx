'use client';

/**
 * CollapsibleSection - Shared collapsible container component
 *
 * A reusable collapsible section with expand/collapse toggle.
 * Supports optional icon and badge in the header.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CollapsibleSectionProps } from './types';

export function CollapsibleSection({
  title,
  defaultOpen = true,
  icon,
  badge,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors ${headerClassName}`}
      >
        <span className="font-medium text-gray-900 flex items-center gap-2">
          {icon}
          {title}
          {badge !== undefined && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              {badge}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className={`px-4 py-4 space-y-4 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;
