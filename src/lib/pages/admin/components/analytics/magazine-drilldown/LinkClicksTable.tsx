"use client";

/**
 * LinkClicksTable - External link clicks table for magazine drilldown
 */

import React from 'react';
import type { InteractionBreakdown } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface LinkClicksTableProps {
  linkClicks?: InteractionBreakdown['linkClicks'];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LinkClicksTable({ linkClicks }: LinkClicksTableProps) {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">External Link Clicks</h4>
      </div>
      {linkClicks && linkClicks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Page</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Section</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Platform</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Clicks</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Unique</th>
              </tr>
            </thead>
            <tbody>
              {linkClicks.map((link, index) => (
                <tr key={`${link.linkType}-${link.pageId}-${link.sectionId || index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {link.pageId !== undefined ? `Page ${link.pageId}` : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {link.sectionTitle || link.sectionType || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 capitalize font-medium">
                    {link.linkType}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {link.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {link.uniqueClickers.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          No link clicks recorded
        </div>
      )}
    </div>
  );
}
