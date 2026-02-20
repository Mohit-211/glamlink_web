"use client";

/**
 * ClickBar - Horizontal bar chart component for click distribution
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface ClickBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ClickBar({
  label,
  value,
  total,
  color,
}: ClickBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-gray-600">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-16 text-sm text-gray-600 text-right">
        {value} ({percentage.toFixed(0)}%)
      </span>
    </div>
  );
}
