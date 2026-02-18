"use client";

/**
 * VideoPlaysTable - Video plays table for magazine drilldown
 */

import React from 'react';
import type { InteractionBreakdown } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface VideoPlaysTableProps {
  videoPlays?: InteractionBreakdown['videoPlays'];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function VideoPlaysTable({ videoPlays }: VideoPlaysTableProps) {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">Video Plays</h4>
      </div>
      {videoPlays && videoPlays.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Page</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Section</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Source</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Plays</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">Unique</th>
              </tr>
            </thead>
            <tbody>
              {videoPlays.map((video, index) => (
                <tr key={`${video.videoSource}-${video.pageId}-${video.sectionId || index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {video.pageId !== undefined ? `Page ${video.pageId}` : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {video.sectionTitle || video.sectionType || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                    {video.videoSource === 'youtube' ? 'YouTube' : 'Uploaded'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {video.plays.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {video.uniqueViewers.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          No video plays recorded
        </div>
      )}
    </div>
  );
}
