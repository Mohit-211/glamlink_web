'use client';

/**
 * CollapsibleFieldGroup - Reusable collapsible container for form fields
 *
 * Groups related form fields under a collapsible header.
 * Used in SectionPositionEditor and ProfileSectionEditor to organize
 * Position, Section Options, Inner Section Options, and Container Styling.
 */

import React, { useState } from 'react';

export interface CollapsibleFieldGroupProps {
  /** Title displayed in the header */
  title: string;
  /** Optional description shown below title */
  description?: string;
  /** Whether the group is expanded by default */
  defaultExpanded?: boolean;
  /** Content to render inside the collapsible area */
  children: React.ReactNode;
  /** Optional additional className for the container */
  className?: string;
}

export function CollapsibleFieldGroup({
  title,
  description,
  defaultExpanded = false,
  children,
  className = '',
}: CollapsibleFieldGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header - Click to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>

        {/* Expand/Collapse Icon */}
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content - Collapsible */}
      {isExpanded && (
        <div className="px-4 py-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleFieldGroup;
