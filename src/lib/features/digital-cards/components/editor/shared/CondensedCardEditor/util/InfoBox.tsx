'use client';

/**
 * InfoBox - Informational help box
 *
 * Displays a blue info box with workflow instructions or
 * helpful information for users.
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface InfoBoxProps {
  /** Title displayed at the top */
  title: string;
  /** Content to display (can be JSX for line breaks, etc.) */
  children: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function InfoBox({ title, children }: InfoBoxProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-blue-800">
            {title}
          </h3>
          <div className="mt-1 text-sm text-blue-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoBox;
