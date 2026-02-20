"use client";

/**
 * SummaryStatsGrid - Reusable 4-column stats grid for analytics panels
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface StatItem {
  label: string;
  value: string | number;
}

interface SummaryStatsGridProps {
  stats: StatItem[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function SummaryStatsGrid({ stats }: SummaryStatsGridProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
