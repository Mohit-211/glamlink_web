"use client";

/**
 * DigitalCardsPanel - Panel showing analytics for all digital business cards
 *
 * Simplified version using shared components and extracted config.
 */

import React, { useState, useMemo } from 'react';
import SimpleTable from '@/lib/pages/admin/components/shared/table/SimpleTable';
import { SummaryStatsGrid } from '../shared';
import { digitalCardsDisplayConfig } from '../config';
import DigitalCardDrilldown from '../card-drilldown';
import type { ProfessionalAnalyticsSummary } from '../useAnalyticsDashboard';

// =============================================================================
// TYPES
// =============================================================================

interface DigitalCardsPanelProps {
  professionals: ProfessionalAnalyticsSummary[];
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DigitalCardsPanel({
  professionals,
  isLoading,
  error,
}: DigitalCardsPanelProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalAnalyticsSummary | null>(null);

  // Transform data for table display
  const tableData = useMemo(() => {
    return professionals.map(pro => ({
      id: pro.id,
      name: pro.name,
      title: pro.title || '-',
      totalViews: pro.stats.totalViews.toLocaleString(),
      uniqueVisitors: pro.stats.uniqueVisitors.toLocaleString(),
      bookClicks: pro.stats.bookClicks.toLocaleString(),
      totalClicks: (
        pro.stats.bookClicks +
        pro.stats.callClicks +
        pro.stats.textClicks +
        pro.stats.websiteClicks +
        pro.stats.instagramClicks +
        pro.stats.tiktokClicks +
        pro.stats.saveCardClicks +
        pro.stats.copyUrlClicks
      ).toLocaleString(),
      _original: pro,
    }));
  }, [professionals]);

  // Handle view action
  const handleView = (row: typeof tableData[number]) => {
    setSelectedProfessional(row._original);
  };

  // Summary stats
  const summaryStats = useMemo(() => [
    { label: 'Total Professionals', value: professionals.length },
    { label: 'Total Views', value: professionals.reduce((sum, p) => sum + p.stats.totalViews, 0) },
    { label: 'Unique Visitors', value: professionals.reduce((sum, p) => sum + p.stats.uniqueVisitors, 0) },
    { label: 'Total Book Clicks', value: professionals.reduce((sum, p) => sum + p.stats.bookClicks, 0) },
  ], [professionals]);

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
        config={digitalCardsDisplayConfig}
        onView={handleView}
        isLoading={isLoading}
        emptyMessage="No digital card analytics yet"
      />

      {/* Drilldown Modal */}
      {selectedProfessional && (
        <DigitalCardDrilldown
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
        />
      )}
    </div>
  );
}
