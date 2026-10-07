'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getAccessCardAnalytics, getAccessCardAnalyticsEvents } from '@/api/Api';
import type { AccessCardData } from '../types';
import type {
  AnalyticsEvents,
  ApiResponse,
  BusinessCardAnalytics,
  DateRangeValue,
} from './types';
import { buildChartSeries, formatRangeLabel, prettyUrl } from './analyticsHelpers';
import AnalyticsDateFilter, { presetRange } from './AnalyticsDateFilter';
import AnalyticsSummaryCards from './AnalyticsSummaryCards';
import ViewsClicksChart from './ViewsClicksChart';
import ClickActivity from './ClickActivity';
import DeviceBreakdown from './DeviceBreakdown';
import RecentActivity from './RecentActivity';
import {
  AnalyticsEmptyState,
  AnalyticsErrorState,
  AnalyticsSkeleton,
} from './AnalyticsStates';

type CardOption = Pick<AccessCardData, 'id' | 'name' | 'business_name' | 'business_card_link'>;

interface LoadedAnalytics {
  summary: BusinessCardAnalytics;
  events: AnalyticsEvents;
}

const DEFAULT_PRESET_DAYS = 30;

export default function AccessCardAnalytics({ cards }: { cards: CardOption[] }) {
  const [selectedId, setSelectedId] = useState<string>(() => String(cards[0]?.id ?? ''));
  const [range, setRange] = useState<DateRangeValue>(() => presetRange(DEFAULT_PRESET_DAYS));
  const [data, setData] = useState<LoadedAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const requestRef = useRef(0);

  // Keep the selection valid if the dashboard's card list changes.
  useEffect(() => {
    if (!cards.some((c) => String(c.id) === selectedId)) {
      setSelectedId(String(cards[0]?.id ?? ''));
    }
  }, [cards, selectedId]);

  const selectedCard = cards.find((c) => String(c.id) === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    const requestId = ++requestRef.current;
    setLoading(true);
    setFailed(false);

    const params = { from: range.from, to: range.to };
    Promise.all([
      getAccessCardAnalytics(selectedId, params) as Promise<ApiResponse<BusinessCardAnalytics>>,
      getAccessCardAnalyticsEvents(selectedId, params) as Promise<ApiResponse<AnalyticsEvents>>,
    ])
      .then(([summaryRes, eventsRes]) => {
        if (requestId !== requestRef.current) return;
        if (!summaryRes?.data?.summary) throw new Error('Malformed analytics response');
        setData({
          summary: summaryRes.data,
          events: {
            count: Number(eventsRes?.data?.count) || 0,
            rows: Array.isArray(eventsRes?.data?.rows) ? eventsRes.data.rows : [],
          },
        });
      })
      .catch((err: unknown) => {
        if (requestId !== requestRef.current) return;
        console.error('Access card analytics failed:', err);
        setData(null);
        setFailed(true);
        toast.error('Unable to load analytics', { id: 'access-card-analytics-error' });
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [selectedId, range.from, range.to, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  const summary = data?.summary;
  // Prefer the range the backend says it applied; fall back to what we asked for.
  const appliedRange = summary?.date_range?.from && summary?.date_range?.to ? summary.date_range : range;
  const rangeLabel = formatRangeLabel(appliedRange.from, appliedRange.to);

  const chartSeries = useMemo(
    () => (summary ? buildChartSeries(summary.daily_views, summary.daily_clicks, appliedRange) : []),
    [summary, appliedRange]
  );

  const info = summary?.business_card;
  const name = info?.name || selectedCard?.name || '';
  const businessName = info?.business_name || selectedCard?.business_name || '';
  const cardLink = info?.business_card_link || selectedCard?.business_card_link || '';

  const isEmpty =
    !!summary &&
    !summary.summary.total_views &&
    !summary.summary.total_clicks &&
    (data?.events.rows.length ?? 0) === 0;

  if (cards.length === 0) {
    return (
      <AnalyticsEmptyState
        title="No Access Card yet"
        message="Create your Access Card to start tracking views and clicks."
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">Access Card Analytics</h2>
          {(name || businessName) && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {[name, businessName].filter(Boolean).join(' • ')}
            </p>
          )}
          {cardLink && (
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
              <span className="min-w-0 max-w-full truncate rounded-md bg-secondary px-2 py-1 font-mono text-[11px] text-muted-foreground">
                {prettyUrl(cardLink)}
              </span>
              <a
                href={cardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:opacity-90"
              >
                <ExternalLink className="h-3 w-3" />
                View Access Card
              </a>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-shrink-0 sm:items-end">
          {cards.length > 1 && (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              aria-label="Select Access Card"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary sm:w-56"
            >
              {cards.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {[c.name, c.business_name].filter(Boolean).join(' • ') || `Card #${c.id}`}
                </option>
              ))}
            </select>
          )}
          <AnalyticsDateFilter value={range} onChange={setRange} disabled={loading} />
          {summary && !loading && (
            <p className="text-[11px] text-muted-foreground">Showing {rangeLabel}</p>
          )}
        </div>
      </div>

      {/* Body */}
      {loading || (!data && !failed) ? (
        <AnalyticsSkeleton />
      ) : failed || !summary || !data ? (
        <AnalyticsErrorState onRetry={retry} />
      ) : (
        <>
          <AnalyticsSummaryCards summary={summary.summary} />
          {isEmpty ? (
            <AnalyticsEmptyState />
          ) : (
            <>
              <ViewsClicksChart data={chartSeries} rangeLabel={rangeLabel} />
              <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                <ClickActivity events={summary.events} />
                <DeviceBreakdown rows={summary.device_breakdown} />
              </div>
              <RecentActivity rows={data.events.rows} total={data.events.count} />
            </>
          )}
        </>
      )}
    </div>
  );
}
