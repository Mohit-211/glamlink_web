"use client";

/**
 * TabButton - Reusable tab button component for analytics navigation
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function TabButton({
  label,
  count,
  active,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative pb-3 text-sm font-medium transition-colors
        ${active
          ? 'text-pink-600'
          : 'text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {label}
      {count > 0 && (
        <span className={`
          ml-2 px-2 py-0.5 text-xs rounded-full
          ${active
            ? 'bg-pink-100 text-pink-600'
            : 'bg-gray-100 text-gray-500'
          }
        `}>
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
      )}
    </button>
  );
}
