"use client";

/**
 * MagazinesPanel - Panel showing analytics for all magazine issues
 *
 * Simplified version using shared components and extracted config.
 */

import React, { useState, useMemo } from 'react';
import SimpleTable from '@/lib/pages/admin/components/shared/table/SimpleTable';
import { SummaryStatsGrid } from '../shared';
import { magazinesDisplayConfig } from '../config';
import MagazineDrilldown from '../magazine-drilldown';
import type { MagazineAnalyticsSummary } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface MagazinesPanelProps {
  magazines: MagazineAnalyticsSummary[];
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function MagazinesPanel({
  magazines,
  isLoading,
  error,
}: MagazinesPanelProps) {
  const [selectedMagazine, setSelectedMagazine] = useState<MagazineAnalyticsSummary | null>(null);

  // Transform data for table display
  const tableData = useMemo(() => {
    return magazines.map(mag => ({
      id: mag.issueId,
      title: mag.title,
      issueNumber: `#${mag.issueNumber}`,
      totalViews: mag.stats.totalViews.toLocaleString(),
      uniqueVisitors: mag.stats.uniqueVisitors.toLocaleString(),
      totalPageViews: mag.stats.totalPageViews.toLocaleString(),
      _original: mag,
    }));
  }, [magazines]);

  // Handle view action
  const handleView = (row: typeof tableData[number]) => {
    setSelectedMagazine(row._original);
  };

  // Summary stats
  const summaryStats = useMemo(() => [
    { label: 'Total Issues', value: magazines.length },
    { label: 'Total Views', value: magazines.reduce((sum, m) => sum + m.stats.totalViews, 0) },
    { label: 'Unique Visitors', value: magazines.reduce((sum, m) => sum + m.stats.uniqueVisitors, 0) },
    { label: 'Total Page Views', value: magazines.reduce((sum, m) => sum + m.stats.totalPageViews, 0) },
  ], [magazines]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Stats */}
      <SummaryStatsGrid stats={summaryStats} />

      {/* Table */}
      <SimpleTable
        data={tableData}
        config={magazinesDisplayConfig}
        onView={handleView}
        isLoading={isLoading}
        emptyMessage="No magazine analytics yet"
      />

      {/* Drilldown Modal */}
      {selectedMagazine && (
        <MagazineDrilldown
          magazine={selectedMagazine}
          onClose={() => setSelectedMagazine(null)}
        />
      )}
    </div>
  );
}
