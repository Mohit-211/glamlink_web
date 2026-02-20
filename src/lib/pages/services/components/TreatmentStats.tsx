'use client';

/**
 * TreatmentStats - Quick stats display for treatment pages
 *
 * Shows professional count, review count, and price range.
 */

import React from 'react';
import type { TreatmentStats as Stats } from '../hooks/useTreatmentData';

// =============================================================================
// TYPES
// =============================================================================

export interface TreatmentStatsProps {
  stats: Stats;
  treatmentName: string;
}

// =============================================================================
// STAT ITEM
// =============================================================================

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-glamlink-teal/10 flex items-center justify-center text-glamlink-teal">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TreatmentStats({ stats, treatmentName }: TreatmentStatsProps) {
  const formattedPrice =
    stats.priceRange.min > 0
      ? `$${stats.priceRange.min} - $${stats.priceRange.max}`
      : 'Varies';

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Pro Count */}
          <StatItem
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            value={stats.proCount > 0 ? `${stats.proCount}+` : 'Growing'}
            label={`${treatmentName} Artists`}
          />

          {/* Review Count */}
          <StatItem
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
            value={stats.reviewCount > 0 ? stats.reviewCount.toLocaleString() : '100+'}
            label="Verified Reviews"
          />

          {/* Price Range */}
          <StatItem
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            value={formattedPrice}
            label="Typical Price Range"
          />
        </div>
      </div>
    </section>
  );
}

export default TreatmentStats;
