'use client';

/**
 * SectionGroup - Collapsible group wrapper for sections
 *
 * Renders a titled, collapsible container for grouping sections
 * with optional header actions.
 *
 * Supports both controlled and uncontrolled modes:
 * - Uncontrolled: Uses defaultExpanded and internal state
 * - Controlled: Uses isExpanded and onToggle props
 */

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionGroupProps {
  title: string;
  count: number;
  /** Initial expanded state (uncontrolled mode) */
  defaultExpanded?: boolean;
  /** Current expanded state (controlled mode) */
  isExpanded?: boolean;
  /** Toggle callback (controlled mode) */
  onToggle?: () => void;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SectionGroup({
  title,
  count,
  defaultExpanded = true,
  isExpanded: controlledExpanded,
  onToggle,
  headerActions,
  children,
}: SectionGroupProps) {
  // Uncontrolled state
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Use controlled or uncontrolled mode
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2 hover:text-gray-700 transition-colors"
        >
          <span className="font-medium text-gray-900">
            {title} ({count})
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="p-3 space-y-2 bg-gray-50/50">
          {children}
        </div>
      )}
    </div>
  );
}

export default SectionGroup;
