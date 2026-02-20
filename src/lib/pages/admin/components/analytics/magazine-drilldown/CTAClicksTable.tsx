"use client";

/**
 * CTAClicksTable - CTA button clicks table for magazine drilldown
 */

import React from 'react';
import type { InteractionBreakdown } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface CTAClicksTableProps {
  ctaClicks?: InteractionBreakdown['ctaClicks'];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CTAClicksTable({ ctaClicks }: CTAClicksTableProps) {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">CTA Button Clicks</h4>
      </div>
      {ctaClicks && ctaClicks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Page</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Section</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Button</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Clicks</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Unique</th>
              </tr>
            </thead>
            <tbody>
              {ctaClicks.map((cta, index) => (
                <tr key={`${cta.buttonLabel}-${cta.pageId}-${cta.sectionId || index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {cta.pageId !== undefined ? `Page ${cta.pageId}` : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {cta.sectionTitle || cta.sectionType || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 font-medium" title={cta.buttonLabel}>
                    {cta.buttonLabel}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {cta.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {cta.uniqueClickers.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          No CTA clicks recorded
        </div>
      )}
    </div>
  );
}
