"use client";

/**
 * PageStatsTable - Per-page analytics table for magazine drilldown
 */

import React from 'react';
import type { PageAnalyticsStats } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface PageStatsTableProps {
  pageStats: PageAnalyticsStats[];
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PageStatsTable({
  pageStats,
  isLoading,
}: PageStatsTableProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Per-Page Analytics
      </h3>
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading page stats...</div>
        ) : pageStats.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Page</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Section</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Views</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Unique Visitors</th>
              </tr>
            </thead>
            <tbody>
              {pageStats.map((page, index) => (
                <tr key={page.pageId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    Page {page.pageId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {page.sectionTitle || page.sectionType || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {page.uniqueVisitors.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No page-level analytics available yet
          </div>
        )}
      </div>
    </div>
  );
}
